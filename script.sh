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
  echo "<html lang='de'>"
  echo "<head>"
  echo "  <meta charset='ISO-8859-1'>"
  echo "  <meta name='viewport' content='width=device-width, minimal-scale=1.0'>"
  echo "  <meta http-equiv='cache-control' content='no-cache'>"
  echo "  <link rel='preload stylesheet' as='style' href='style.css?$RANDOM$RANDOM' >"
  echo "  <link rel='icon' type='image/svg' href='./timetable-icon.svg'>"
  echo "  <title>Vertretungsplan</title>"
  echo "</head>"
  echo "<body>"
} >> $output

date1=$(grep -oP 'Stand:\s*\K[\d.]+\s*[\d:]+' /usr/share/nginx/html/file1.html)
date2=$(grep -oP 'Stand:\s*\K[\d.]+\s*[\d:]+' /usr/share/nginx/html/file2.html)
date3=$(grep -oP 'Stand:\s*\K[\d.]+\s*[\d:]+' /usr/share/nginx/html/file3.html)
dates=("$date1" "$date2" "$date3")

# Extract body content from each file and append to the new body
# Input files
set -- "/usr/share/nginx/html/file1.html" "/usr/share/nginx/html/file2.html" "/usr/share/nginx/html/file3.html"
i=0
for file in "$@"; do
  # Extract content
  if ! grep -q "<title>404 Not Found</title>" "$file"; then
    body_content=$(sed -n '/<center>/,/<center>/p' "$file" | sed '1d;$d' \
      | sed 's/<th class="list" align="center">Text<\/th>//g'\
      | sed 's/<\/center>//g'\
      | sed 's/<div class="mon_title">/<div class="heading"><div class="mon_title">/g'\
      | sed 's/<table class="mon_list" >/<\/div><table class="mon_list" >/g'\
      | sed 's/<td class="list" align="center">&nbsp;<\/td><\/tr>/<\/tr>/g' \
      | sed 's/<p>//g' \
      | sed 's/<font[*]+<\/font>//g')
    echo "$body_content" >> $output
    echo "<span class='last-updated'>Stand: ${dates[i]}</span>" >> $output
  fi
  ((i++))
done

# Close the body and html tags
# echo "</center>" >> $output
{
  echo "<script src='app.js'></script>"
  echo "<h2 id='disclaimer' style='text-align:center; margin: 0.5rem auto'>Diese Website ist nicht offiziell von der Schule und somit auch nicht verantwortlich f&uuml;r eventuelle Missverst&auml;ndnisse!</h1>"
  echo "<h4 style='text-align: center; margin: 0.5rem auto'>$(TZ='Europe/Berlin' date)</h4>"
  echo "<h4 style='text-align: center; margin: 0.5rem auto'><a href='https://github.com/timitoerner/fsm.timitoerner.org' target='_blank'>Source Code</a> <a href='https://fsm.timitoerner.org/impressum.png' target='_blank'>Impressum</a></h4>"
  echo "<h1 style='text-align: center; margin: 0.5rem auto'><a href='https://www.paypal.me/timotheus4910' target='_blank' style='text-decoration: none;'>Mich unterst&uuml;tzen! 	&#128154;</a></h4>"
  echo "</body>"
  echo "</html>"
} >> $output
