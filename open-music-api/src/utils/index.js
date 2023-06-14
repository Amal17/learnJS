/* eslint-disable camelcase */
const mapAlbumToModel = ({
  id,
  name,
  year,
  created_at,
  updated_at
}) => ({
  id,
  name,
  year: parseInt(year)
})

const mapSongToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
  created_at,
  updated_at
}) => ({
  id,
  title,
  year: parseInt(year),
  performer,
  genre,
  duration,
  albumId: album_id
})

module.exports = { mapAlbumToModel, mapSongToModel }
