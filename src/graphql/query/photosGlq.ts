import gql from 'graphql-tag'

// Lấy danh sách tất cả ảnh
export const GET_PHOTOS = gql`
query Photos {
    photos {
        url
        filename
        takenAt
        metadata
        deletedAt
        createdAt
        id
        userId
    }
}
`

