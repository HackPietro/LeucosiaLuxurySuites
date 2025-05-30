package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Data.Dao.NewsDao;
import com.leucosia.luxurysuites.Data.Entities.News;
import com.leucosia.luxurysuites.Dto.NewsDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsServiceImpl implements NewsService {

    private final NewsDao newsDao;
    private final ModelMapper modelMapper;

    public NewsServiceImpl(NewsDao newsDao, ModelMapper modelMapper) {
        this.newsDao = newsDao;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<NewsDto> getAllNews() {
        return newsDao.findAll()
                .stream()
                .map(news -> modelMapper.map(news, NewsDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public NewsDto createNews(NewsDto dto) {
        News news = modelMapper.map(dto, News.class);
        news.setId(null);
        news.setData(LocalDate.now());
        News salvata = newsDao.save(news);
        return modelMapper.map(salvata, NewsDto.class);
    }

    @Override
    public void deleteNews(Long id) {
        newsDao.deleteById(id);
    }
}
