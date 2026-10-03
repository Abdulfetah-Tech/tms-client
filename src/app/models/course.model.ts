export interface Course {
id: number;
code: string;
title: string;
maxCapacity: number;
enrollmentCount: number;
status?: string;
}
export interface PagedResponse<T> {
items: T[];
totalCount: number;
page: number;
pageSize: number;
totalPages: number;
hasPrevious: boolean;
hasNext: boolean;
}