import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '~/environment'
import { type MapPoint, type PlayListItem } from './types'

export const apiSlice = createApi({
  reducerPath: 'api', // The name of the reducer in the store
  baseQuery: fetchBaseQuery({ baseUrl: ENV.api.url }),
  tagTypes: ['Movies'],
  endpoints: (builder) => ({

    // GET /api/playlist
    getTracks: builder.query<PlayListItem[], void>({
      query: () => `/playlist`,
    }),

    // GET /api/map/{id} - Get Map
    getMapPoints: builder.query<MapPoint[], string>({
      query: (id) => `/map/${id}`,
    }),

  }),
});

export const {
  useGetTracksQuery,
  useGetMapPointsQuery,
} = apiSlice;