package com.delasoft;
 

import static com.google.common.base.Predicates.or;
import static com.google.common.collect.Lists.newArrayList;
import static springfox.documentation.builders.PathSelectors.regex;
import static springfox.documentation.schema.AlternateTypeRules.newRule;

import java.util.List;

import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.classmate.TypeResolver;
import com.google.common.base.Predicate;
import com.google.common.base.Predicates;

import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.builders.ResponseMessageBuilder;
import springfox.documentation.schema.AlternateTypeRule;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.schema.WildcardType;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.paths.AbstractPathProvider;
import springfox.documentation.spring.web.paths.Paths;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger.web.ApiKeyVehicle;
import springfox.documentation.swagger.web.SecurityConfiguration;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig{ 
	@Bean
	  public Docket petApi() {
		String version="1.0";
		    return new Docket(DocumentationType.SWAGGER_2)
		        .select()
		          .apis(RequestHandlerSelectors.any())
		          .apis(Predicates.not(RequestHandlerSelectors.basePackage("org.springframework.boot")))
		          .apis(Predicates.not(RequestHandlerSelectors.basePackage("org.springframework.cloud")))
		          .paths(PathSelectors.any())//paths()
		          .build()
		          .apiInfo(apiInfo(version))     
		          //.pathProvider(new BasePathAwareRelativePathProvider("/api/" + version))
		        .pathMapping("")
		        .directModelSubstitute(LocalDate.class,String.class)
		        .genericModelSubstitutes(ResponseEntity.class)
		        .alternateTypeRules(typeRule())
		        .useDefaultResponseMessages(true)
		       .globalResponseMessage(RequestMethod.GET,
		            newArrayList(new ResponseMessageBuilder()
		                .code(500)
		                .message("Server Error")
		                .responseModel(new ModelRef("Error"))
		                .build(),new ResponseMessageBuilder()
		                .code(404)
		                .message("Not Found")
		                .responseModel(new ModelRef("Error"))
		                .build(),new ResponseMessageBuilder()
		                .code(401)
		                .message("Not Authorized")
		                .responseModel(new ModelRef("Error"))
		                .build()))
		       	.globalResponseMessage(RequestMethod.POST,
		            newArrayList(new ResponseMessageBuilder()
		                .code(500)
		                .message("Server Error")
		                .responseModel(new ModelRef("Error"))
		                .build(),new ResponseMessageBuilder()
		                .code(404)
		                .message("Not Found")
		                .responseModel(new ModelRef("Error"))
		                .build(),new ResponseMessageBuilder()
		                .code(401)
		                .message("Not Authorized")
		                .responseModel(new ModelRef("Error"))
		                .build()))
		     	.globalResponseMessage(RequestMethod.PUT,
		            newArrayList(new ResponseMessageBuilder()
		                .code(500)
		                .message("Server Error")
		                .responseModel(new ModelRef("Error"))
		                .build(),new ResponseMessageBuilder()
		                .code(404)
		                .message("Not Found")
		                .responseModel(new ModelRef("Error"))
		                .build(),new ResponseMessageBuilder()
		                .code(401)
		                .message("Not Authorized")
		                .responseModel(new ModelRef("Error"))
		                .build()))
		     	.globalResponseMessage(RequestMethod.DELETE,
		            newArrayList(new ResponseMessageBuilder()
		                .code(500)
		                .message("Server Error")
		                .responseModel(new ModelRef("Error"))
		                .build(),new ResponseMessageBuilder()
		                .code(404)
		                .message("Not Found")
		                .responseModel(new ModelRef("Error"))
		                .build(),new ResponseMessageBuilder()
		                .code(401)
		                .message("Not Authorized")
		                .responseModel(new ModelRef("Error"))
		                .build()))
		       // .securitySchemes(newArrayList(apiKey()))
		       // .securityContexts(newArrayList(securityContext()))
		     /*   .globalOperationParameters(
		                newArrayList(new ParameterBuilder()
		                    .name("authcookie")
		                    .description("Token")
		                    .modelRef(new ModelRef("string"))
		                    .parameterType("header")
		                    .required(true)
		                    .build()))*/
		        //.enableUrlTemplating(true) 
		        .tags(new springfox.documentation.service.Tag("DATA", "TSDM DVL")) 
		        //.additionalModels(typeResolver.resolve(AdditionalModel.class)) 
		        ;
		  }

/**
 * Type Resolver
 * @return AlternateTypeRule
 */
private AlternateTypeRule  typeRule(){
    return newRule(typeResolver.resolve(DeferredResult.class,
            typeResolver.resolve(ResponseEntity.class, WildcardType.class)),
        typeResolver.resolve(WildcardType.class));
}
	
	private ApiInfo apiInfo(String version) {
	    @SuppressWarnings("deprecation")
		ApiInfo apiInfo = new ApiInfo(
	      "TSDM DVL REST API",
	      "",
	      "TSDM DVL DATA v1.0",
	      "",//Terms of service
	      "myeaddress@company.com",
	      "",//License of API
	      ""//API license URL
	      );
	    return apiInfo;
	}
	   
	@SuppressWarnings("unchecked")
	private Predicate<String> paths() {
	    return or(
	    		regex("/*"),
	    		regex("/rest/services/*"));
	  }
		  @Autowired
		  private TypeResolver typeResolver;

		  private ApiKey apiKey() {
		    return new ApiKey("mykey", "api_key", "header");
		  }

		  private SecurityContext securityContext() {
		    return SecurityContext.builder()
		        .securityReferences(defaultAuth())
		        .forPaths(PathSelectors.regex("/"))
		        .build();
		  }

		  List<SecurityReference> defaultAuth() {
		    AuthorizationScope authorizationScope
		        = new AuthorizationScope("global", "accessEverything");
		    AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
		    authorizationScopes[0] = authorizationScope;
		    return newArrayList(
		        new SecurityReference("mykey", authorizationScopes));
		  }

		  @Bean
		  SecurityConfiguration security() {
		    return new SecurityConfiguration(
		        "data-client-id",
		        "data-client-secret",
		        "data-realm",
		        "data",
		        "apiKey",
		        ApiKeyVehicle.HEADER, 
		        "api_key", 
		        "," /*scope separator*/);
		  }

		  class BasePathAwareRelativePathProvider extends AbstractPathProvider {
		        private String basePath;

		        public BasePathAwareRelativePathProvider(String basePath) {
		            this.basePath = basePath;
		        }

		        @Override
		        protected String applicationPath() {
		            return basePath;
		        }

		        @Override
		        protected String getDocumentationPath() {
		            return "/";
		        }

		        @Override
		        public String getOperationPath(String operationPath) {
		            UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.fromPath("/");
		            return Paths.removeAdjacentForwardSlashes(
		                    uriComponentsBuilder.path(operationPath.replaceFirst(basePath, "")).build().toString());
		        }
		    }
}
