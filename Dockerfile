# Sử dụng base image có cả Python và Node.js
FROM python:3.12-slim

# Cài đặt Node.js và các dependency cần thiết
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Cài đặt các thư viện Python cần thiết cho script patch
RUN pip install pillow

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép các file cấu hình và cài đặt dependencies frontend
# Copy package.json trước để tận dụng layer caching của Docker
COPY web/package.json ./web/
RUN cd web && npm install

# Mặc định entrypoint là shell
CMD ["/bin/bash"]
