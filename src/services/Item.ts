import { GraphQLClient, gql } from 'graphql-request';
import type { StorageItem } from '../types/StorageItem';

const BASE_URL = 'http://localhost:8080';
const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql';
const UPLOAD_ENDPOINT = 'http://localhost:8080/api/v1/media/upload';

const client = new GraphQLClient(GRAPHQL_ENDPOINT);

// ======================================================
// 📦 1️⃣ LẤY DANH SÁCH FOLDER + MEDIA (rootItems)
// ======================================================
export const fetchAllItems = async (userId: string | null = null): Promise<StorageItem[]> => {
const query = gql`
query RootItems($userId: ID!) {
  rootItems(userId: $userId) {
    __typename
    ... on FolderDocument {
      id
      name
      path
      isShared
      createdAt
      updatedAt
    }
    ... on MediaDocument {
      id
      url
      mimeType
      size
      likeCount
      createdAt
      updatedAt
    }
  }
}
`;
  const TEST_USER_ID = '68f1ab012f488200046911e4';
  const variables = { 
    userId: userId ?? TEST_USER_ID // Lấy từ tham số, nếu null thì dùng TEST_USER_ID
  };
  const { rootItems } = await client.request(query, variables);

  // Chuẩn hóa dữ liệu từ GraphQL về StorageItem
  return rootItems.map((item: any) => {
    if (item.__typename === 'FolderDocument') {
      return {
        id: item.id,
        name: item.name,
        type: 'folder',
        isDeleted: item.isDeleted ?? false,
        isShared: item.isShared ?? false,
        coverUrl: item.coverUrl ?? undefined,
        path: item.path ?? '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      } as StorageItem;
    }

    // MediaDocument
    return {
      id: item.id,
      name: item.filename ?? 'unknown',
      type: 'media',
      isDeleted: item.isDeleted ?? false,
      size: item.size ?? 0,
      mimeType: item.mimeType ?? '',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      coverUrl: item.url
  ? item.url.startsWith('http')
    ? item.url
    : `${BASE_URL}${item.url}`
  : undefined,
      photoMeta: item.photoMeta
        ? {
            width: item.photoMeta.width,
            height: item.photoMeta.height,
            cameraModel: item.photoMeta.cameraModel,
            iso: item.photoMeta.iso,
            aperture: item.photoMeta.aperture,
          }
        : undefined,
      videoMeta: item.videoMeta
        ? {
            duration: item.videoMeta.duration,
            resolution: item.videoMeta.resolution,
            frameRate: item.videoMeta.frameRate,
          }
        : undefined,
    } as StorageItem;
  });
};

// ======================================================
// ☁️ 2️⃣ UPLOAD MEDIA (REST API)
// ======================================================
export const uploadNewItem = async (file: File): Promise<StorageItem> => {
  const TEST_USER_ID = '68f1ab012f488200046911e4';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', TEST_USER_ID);

  const response = await fetch(UPLOAD_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Upload failed: ${err}`);
  }

  const data = await response.json();

  // Chuẩn hóa phản hồi upload thành StorageItem
  return {
    id: data.id ?? crypto.randomUUID(),
    name: data.filename ?? file.name,
    type: 'media',
    isDeleted: false,
    mimeType: data.mimeType ?? file.type,
    size: data.size ?? file.size,
coverUrl: data.url
  ? data.url.startsWith('http')
    ? data.url
    : `${BASE_URL}${data.url}`
  : undefined,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString(),
  } as StorageItem;
};

// ======================================================
// 📁 3️⃣ TẠO ALBUM MỚI (GraphQL Mutation)
// ======================================================
export const createNewAlbum = async (name: string, isShared = false): Promise<StorageItem> => {
  const mutation = gql`
    mutation CreateFolder($input: FolderInput!) {
      createFolder(input: $input) {
        id
        name
        path
        isShared
        isDeleted
        createdAt
        updatedAt
      }
    }
  `;

  const variables = {
    input: {
      name,
      ownerId: '68f1ab012f488200046911e4', // TODO: Lấy từ Auth Store
      parentId: null,
      isShared,
      path: '',
    },
  };

  const { createFolder } = await client.request(mutation, variables);

  return {
    id: createFolder.id,
    name: createFolder.name,
    type: 'folder',
    isDeleted: createFolder.isDeleted ?? false,
    isShared: createFolder.isShared ?? false,
    coverUrl: undefined,
    path: createFolder.path,
    createdAt: createFolder.createdAt,
    updatedAt: createFolder.updatedAt,
  } as StorageItem;
};
