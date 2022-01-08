package com.delasoft;

import java.util.Base64;
import javax.servlet.Filter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.delasoft.security.CookiePreAuth;
import com.delasoft.security.TokenHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
 


@Configuration
@EnableWebSecurity
public class TsmSecurityConfig extends WebSecurityConfigurerAdapter{

	   
	     
	     @Value(value = "${application.secretkey}")
	 	 private String secret;
	     
		 
		  
		  @Bean
		  public  Filter cookierAuthFilter(){
			  
			  return new CookiePreAuth(getMapper(),getTokenHandler());
		  }
		  @Bean
		  public TokenHandler getTokenHandler(){
			  return new TokenHandler( Base64.getEncoder().encode(secret.getBytes()));
		  }
		  
		  
		 
		  @Override
		  protected void configure(HttpSecurity http) throws Exception {
		    
		    http
		      .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
		      .exceptionHandling().and()
		       
		      .addFilterBefore(cookierAuthFilter(), BasicAuthenticationFilter.class)
		      .authorizeRequests().antMatchers(HttpMethod.OPTIONS).permitAll().and()
		      .authorizeRequests().antMatchers("/rest/**").permitAll().and()		     
		      .authorizeRequests().antMatchers("/v2/api-docs", "/configuration/ui", "/swagger-resources/**", "/configuration/security", "/swagger-ui.html", "/webjars/**").permitAll().and()
			     
		      .authorizeRequests().anyRequest(). authenticated()
		       
		      .and().csrf().disable()
		      ;
		     }
		  
		@Bean(name="ObjectMapper")
		public ObjectMapper getMapper(){
			  return new ObjectMapper();
		}
		
		 
	
}
