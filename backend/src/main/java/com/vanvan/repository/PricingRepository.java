package com.vanvan.repository;

import com.vanvan.model.Pricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PricingRepository extends JpaRepository<Pricing, String> {}