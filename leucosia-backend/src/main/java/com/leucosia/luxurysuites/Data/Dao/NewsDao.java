package com.leucosia.luxurysuites.Data.Dao;


import com.leucosia.luxurysuites.Data.Entities.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsDao extends JpaRepository<News, Long> {
}

