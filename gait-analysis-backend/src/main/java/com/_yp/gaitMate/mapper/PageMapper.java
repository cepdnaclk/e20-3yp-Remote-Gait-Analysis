package com._yp.gaitMate.mapper;

import com._yp.gaitMate.dto.page.PageResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

@Component
public class PageMapper {

    public <T> PageResponseDto<T> toPageResponse(Page<T> page) {
        return PageResponseDto.<T>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .sort(toSortInfo(page.getSort())) // ✅ custom sort mapping
                .build();
    }

    private PageResponseDto.SortInfo toSortInfo(Sort sort) {
        return PageResponseDto.SortInfo.builder()
                .empty(sort.isEmpty())
                .sorted(sort.isSorted())
                .unsorted(sort.isUnsorted())
                .build();
    }
}
