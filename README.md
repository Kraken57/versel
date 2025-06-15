# (versel) Vercel Clone

A simplified Vercel-like deployment platform, built from scratch. The project is split into three core services:

* **Upload Service**
* **Deploy Service**
* **Request Handler**

This README describes the project structure, workflow, technologies used, and future improvements.

---

## 🚀 Overview

This Versal clone allows you to deploy frontend applications from GitHub with a basic CI/CD flow. Files are stored in Cloudflare R2, deployment is handled via a custom service, and queued using Redis for asynchronous processing.

---

## 🧱 Project Architecture

### 1. **Upload Service**

* Accepts a GitHub repository link.
* Downloads and extracts all repository files.
* Uploads files to **Cloudflare R2** (used as an S3-compatible storage).
* Returns a **random 5-digit folder ID** where files are stored.

### 2. **Deploy Service**

* Fetches the uploaded files from Cloudflare R2.
* Installs dependencies with `npm install`.
* Builds the project using `npm run build`.
* (Currently not Dockerized, but intended for future enhancement.)
* Project is added to a **Redis queue** for deployment.

### 3. **Request Handler**

* Picks jobs from the Redis queue.
* Deploys projects to a URL (currently mocked via `127.0.0.1` redirection).
* Handles routing and reloads pages to reflect deployment.

---

## 🛠️ Technologies Used

* **Node.js** (for backend services)
* **Cloudflare R2** (S3-compatible object storage)
* **Redis** (for queuing deployments)
* **GitHub** (source of code repos)
* **Shell commands** for installing and building projects

---

## 🔧 How It Works (Flow)

1. **Upload:** GitHub repo URL → Files extracted → Stored in Cloudflare R2 → Folder ID returned.
2. **Queue:** Folder ID added to Redis queue.
3. **Deploy:** Files fetched from R2 → `npm install` → `npm run build` → Served locally via 127.0.0.1.

---

## 📦 Planned Improvements

### 🔹 Dockerization

* Replace raw `npm install` and `npm run build` with containerized environments.
* Recommended workflow:

```bash
# Step 1: Build the image
DOCKER_BUILDKIT=1 docker build -t project-build .

# Step 2: Run the container with env variables
docker run -e FOLDER_ID=xxxxx -e DEPLOY_TOKEN=xxxxx project-build
```

### 🔹 Kubernetes Integration

* Deploy services in a Kubernetes cluster instead of local IPs.
* Assign each deployment a stable, public-facing URL.

### 🔹 Security Improvements

* Avoid direct execution of user-supplied code.
* Sandbox build processes via Docker or VMs.
* Validate and sanitize GitHub URLs.

### 🔹 Build Logs and Status

* Add support for build logs and deployment status tracking.
* Possibly use WebSockets for real-time updates.

### 🔹 Better URL Mapping

* Replace current 127.0.0.1 redirect approach.
* Use a reverse proxy (like NGINX or Traefik) for routing based on project ID.

---

## 📁 Folder Structure (Example)

```
/vercel-clone
├── upload-service/
├── deploy-service/
├── request-handler/
└── README.md
```
