
type IOptions = {
    page?: number | string;
    limit?: number | string;
    sortOrder?: string;
    sortBy?: string
}

type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}

const paginationAndSortingHelper = (options: IOptions): IOptionsResult => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = Math.ceil((page - 1) * limit);

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    return {
        page, limit, skip, sortBy, sortOrder
    }
}

export default paginationAndSortingHelper;