package com.delasoft.security;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
 

public class TokenHandler {
	private  String HMAC_ALGO = "HmacSHA256";

	private String  SEPARATOR = ".";
	private final Mac hmac;

   
	public TokenHandler(byte[] secretKey) {
		try {
			hmac = Mac.getInstance(HMAC_ALGO);
			hmac.init(new SecretKeySpec(secretKey, HMAC_ALGO));
		} catch (NoSuchAlgorithmException | InvalidKeyException e) {
			throw new IllegalStateException(
				"failed to initialize HMAC: " + e.getMessage(), e);
		}
	}
	public String createTokenForUser(String jsonauth) {
		byte[] userBytes = jsonauth.getBytes();
		byte[] hash = createHmac(userBytes);
		final StringBuilder sb = new StringBuilder();
		sb.append(toBase64(userBytes));
		sb.append(SEPARATOR);
		sb.append(toBase64(hash));
		return sb.toString();
	}
	
	public String parseUserFromToken(String token) {
		final String[] parts = token.split("\\.");
		System.out.println(parts.length+" cooker parse length"+" "+parts[0].length()+" "+parts[1].length()); 
		 
		if (parts.length == 2 && parts[0].length() > 0 && parts[1].length() > 0) {
			try {
				final byte[] userBytes = fromBase64(parts[0]);
				final byte[] hash = fromBase64(parts[1]);
				final byte[] finalhash =createHmac(userBytes);
				System.out.println(new String(finalhash));
				System.out.println(new String(hash));
				boolean validHash = Arrays.equals(finalhash , hash);
				if (validHash) {
					return new String(userBytes);
				}
			} catch (Exception e) {
				//log tampering attempt here
				e.printStackTrace();
			}
		}
		return null;
	}
	private synchronized byte[] createHmac(byte[] content) {
		return hmac.doFinal(content);
	}
	protected String toBase64(byte[] x){
		
		return Base64.getEncoder().encodeToString(x);
	}
	protected byte[] fromBase64(String x){
		
		return Base64.getDecoder().decode(x);
	}
}
