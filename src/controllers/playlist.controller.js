import mongoose, {isValidObjectId} from "mongoose";
import {Playlist} from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const {name, description} = req.body

  //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
  const {playlistId} = req.params
  //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
  const {playlistId} = req.params
  //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const {playlistId, videoId} = req.params
})

