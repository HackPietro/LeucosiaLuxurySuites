package com.leucosia.luxurysuites.Data.Dao;

import com.leucosia.luxurysuites.Data.Entities.Messaggi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessaggiDao extends JpaRepository<Messaggi, Long> {

}
