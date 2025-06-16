package com.leucosia.luxurysuites.Controller;

import com.leucosia.luxurysuites.Data.Service.NewsService;
import com.leucosia.luxurysuites.Dto.NewsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/news-api")
@RequiredArgsConstructor
public class NewsController {

    @Autowired
    private NewsService newsService;

    @GetMapping
    public List<NewsDto> getAllNews() {
        return newsService.getAllNews();
    }

    @PostMapping
    public NewsDto createNews(@RequestBody NewsDto newsDto) {
        return newsService.createNews(newsDto);
    }


    @DeleteMapping("/{id}")
    public void deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
    }

}
