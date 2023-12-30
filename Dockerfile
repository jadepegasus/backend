# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=18.16.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production
ENV PORT 443
ENV MONGODB_URI mongodb+srv://nhomcongngheweb:O9uMLFGVEUyGmfdf@cluster0.lwczcd9.mongodb.net/mangxahoi?retryWrites=true&w=majority
ENV GOOGLE_CLIENT_ID 1015416989645-seo8vluhdf53sro8acp9gtnvg8ghbj2i.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET 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
ENV FACEBOOK_APP_ID 1057653378578142
ENV FACEBOOK_APP_SECRET a8c550a0a1b4d6370cde111c1031db74

WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 443

# Run the application.
CMD npm start
