package com.certaint.curevo.service;

import com.certaint.curevo.interfaces.ImageHostingProvider;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageHostingService {
    private final ImageHostingProvider imageHostingProvider;

    public ImageHostingService(ImageHostingProvider imageHostingProvider) {
        this.imageHostingProvider = imageHostingProvider;
    }

    public String uploadImage(MultipartFile file, String folderName) {
        return imageHostingProvider.uploadImage(file, folderName);
    }

    public String deleteImage(String imageUrl) {
        return imageHostingProvider.deleteImage(imageUrl);
    }
}


