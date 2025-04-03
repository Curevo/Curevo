package com.certaint.curevo.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface ImageHostingProvider {
    String uploadImage(MultipartFile file, String folderName);
    String deleteImage(String imageUrl);
}

