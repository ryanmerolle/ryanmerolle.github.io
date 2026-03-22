FROM ruby:3.2-alpine

# Install build dependencies for Jekyll and native extensions
RUN apk update && \
    apk add --no-cache build-base gcc cmake git bash nodejs tzdata

# Set the working directory
WORKDIR /srv/jekyll

# Install specific bundler version to match Gemfile.lock
RUN gem install bundler -v 2.3.25

# Copy the Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install the dependencies
RUN bundle install

# Copy the application code
COPY . .

# Expose port for Jekyll
EXPOSE 4000
