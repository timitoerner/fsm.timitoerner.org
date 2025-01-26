#!/bin/bash

rm /usr/share/nginx/html/file*.html

curl https://www.friedensschule.de/fileadmin/user_upload/Vertretungsplan_Ablage/subst_001.htm \
| sed 's/Invalid.*//g' > /usr/share/nginx/html/file1.html

curl https://www.friedensschule.de/fileadmin/user_upload/Vertretungsplan_Ablage/subst_002.htm \
| sed 's/Invalid.*//g' > /usr/share/nginx/html/file2.html

curl https://www.friedensschule.de/fileadmin/user_upload/Vertretungsplan_Ablage/subst_003.htm \
| sed 's/Invalid.*//g' > /usr/share/nginx/html/file3.html

# Create a new HTML file with a new head and combined body
output="/usr/share/nginx/html/index.html"

# Start with the head tag
echo "<!DOCTYPE html>" > $output
{
  echo "<html>"
  echo "<head>"
  echo "  <meta charset='ISO-8859-1'>"
  echo "  <meta name='viewport' content='width=device-width, minimal-scale=1.0'>"
  echo "  <link rel='preload stylesheet' as='style' href='style.css' >"
  echo "  <title>Vertretungsplan</title>"
  echo "</head>"
  echo "<body>"
} >> $output

# Extract body content from each file and append to the new body
# Input files
set -- "/usr/share/nginx/html/file1.html" "/usr/share/nginx/html/file2.html" "/usr/share/nginx/html/file3.html"
for file in "$@"; do
  # Extract content
  body_content=$(sed -n '/<center>/,/<center>/p' "$file" | sed '1d;$d' \
    | sed 's/<th class="list" align="center">Text<\/th>//g'\
    | sed 's/<\/center>//g'\
    | sed 's/<div class="mon_title">/<div class="heading"><div class="mon_title">/g'\
    | sed 's/<table class="mon_list" >/<\/div><table class="mon_list" >/g'\
    | sed 's/<td class="list" align="center">&nbsp;<\/td><\/tr>/<\/tr>/g')
  echo "$body_content" >> $output
done

# Close the body and html tags
# echo "</center>" >> $output
{
  echo "<script src='app.js'></script>"
  echo "<h2 id='disclaimer' style='text-align:center; margin: 0.5rem auto'>Diese Website ist nicht offiziell von der Schule und somit auch nicht verantwortlich f&uuml;r eventuelle Misverst&auml;ndnisse!</h1>"
  echo "<p style='text-align: center; margin: 0.5rem auto'>$(TZ='Europe/Berlin' date)</p>"
  echo "</body>"
  echo "</html>"
} >> $output
