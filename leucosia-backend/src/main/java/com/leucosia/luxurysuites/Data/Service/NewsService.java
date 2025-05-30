package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Dto.NewsDto;

import java.util.List;

public interface NewsService {
    List<NewsDto> getAllNews();
    NewsDto createNews(NewsDto newsDto);
    void deleteNews(Long id);
}
