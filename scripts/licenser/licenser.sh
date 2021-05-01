#!/usr/bin/bash
shopt -s globstar

for file in src/**/*.ts
do
  if [ -f "$file" ] && ! grep -q Copyright "$file"
  then
    cat scripts/licenser/header.txt "$file" > "$file.licensed" && mv "$file.licensed" "$file"
    git add "$file"
  fi
done
