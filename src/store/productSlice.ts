import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '../types/product';
import type { ProductList } from "../types/productList.ts";

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getProducts: builder.query<ProductList, void>({
            query: () => 'products',
            providesTags: ['Product'],
        }),
        createProduct: builder.mutation<Product, FormData>({
            query: (body) => ({ url: 'products', method: 'POST', body }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation<Product, FormData>({
            query: (body) => ({ url: `products`, method: 'PUT', body }),
            invalidatesTags: ['Product'],
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({ url: `products/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Product'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productsApi;