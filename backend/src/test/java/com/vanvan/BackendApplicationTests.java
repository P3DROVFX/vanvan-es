package com.vanvan;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(properties = {
    "jwt.secret=chave-secreta-muito-segura-para-testes-mockados",
    "spring.datasource.url=jdbc:h2:mem:vanvantestdb;DB_CLOSE_DELAY=-1",
    "spring.datasource.driverClassName=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
@ActiveProfiles("test")
class BackendApplicationTests {

	@Test
	void contextLoads() {
		//verifica se o contexto do Spring Boot carrega sem erros
	}

}
