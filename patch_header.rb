text = File.read("_includes/header.html")

# Remove the social nav from navigation-wrapper
social_nav_regex = %r{<nav class="cover-navigation navigation--social">.*?</nav>}m
social_nav_content = text[social_nav_regex]

text.sub!(social_nav_regex, "")

# Insert it under the blurb text
insertion_point = %r{<p class="panel-cover__description">\{\{ site\.description \}\}</p>\s*}
text.sub!(insertion_point) do |match|
  "#{match}#{social_nav_content}\n"
end

File.write("_includes/header.html", text)
