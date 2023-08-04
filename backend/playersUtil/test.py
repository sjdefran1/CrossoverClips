def split_array_into_pages(arr, page_length):
    page_dict = {}
    num_pages = (len(arr) + page_length - 1) // page_length  # Calculate the number of pages

    for page_num in range(1, num_pages + 1):
        start_idx = (page_num - 1) * page_length
        end_idx = start_idx + page_length
        page_dict[page_num] = arr[start_idx:end_idx]

    return page_dict

# Example usage:
arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
page_length = 5
page_dict = split_array_into_pages(arr, page_length)
print(page_dict)
