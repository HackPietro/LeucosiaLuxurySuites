package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Data.Dao.NewsDao;
import com.leucosia.luxurysuites.Data.Entities.News;
import com.leucosia.luxurysuites.Dto.NewsDto;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsServiceImpl implements NewsService {

    @Autowired
    private NewsDao newsDao;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<NewsDto> getAllNews() {
        return newsDao.findAll()
                .stream()
                .map(news -> modelMapper.map(news, NewsDto.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void createNews(NewsDto dto) {
        News news = modelMapper.map(dto, News.class);
        news.setId(null);
        news.setData(LocalDate.now());
        newsDao.save(news);
    }

    @Override
    @Transactional
    public void deleteNews(Long id) {
        newsDao.deleteById(id);
    }
}
