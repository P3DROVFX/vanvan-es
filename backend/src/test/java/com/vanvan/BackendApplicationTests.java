package com.vanvan;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Desabilitado pois o contexto do GitHub Actions funde as credenciais do H2")
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }

}