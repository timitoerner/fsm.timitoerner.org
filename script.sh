#!/bin/bash

mkdir -p src/html

curl https://www.friedensschule.de/fileadmin/user_upload/Vertretungsplan_Ablage/subst_001.htm \
  | sed 's/Invalid.*//g' > src/html/file1.html

curl https://www.friedensschule.de/fileadmin/user_upload/Vertretungsplan_Ablage/subst_002.htm \
  | sed 's/Invalid.*//g' > src/html/file2.html

curl https://www.friedensschule.de/fileadmin/user_upload/Vertretungsplan_Ablage/subst_003.htm \
  | sed 's/Invalid.*//g' > src/html/file3.html

 # cp ./data/file1.html ./data/file2.html

# Input files
files=("./src/html/file1.html" "./src/html/file2.html" "./src/html/file3.html")

# Create a new HTML file with a new head and combined body
output="./src/html/index.html"

# Start with the head tag
echo "<!DOCTYPE html>" > $output
echo "<html>" >> $output
echo "<head>" >> $output
echo "  <meta charset='ISO-8859-1'>" >> $output
echo "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>" >> $output
echo "  <link rel='preload stylesheet' as='style' href='style.css' >" >> $output
echo "  <title>Vertretungsplan</title>" >> $output
echo "</head>" >> $output

# Start the body tag
echo "<body>" >> $output
# echo "<center>" >> $output

# Extract body content from each file and append to the new body
for file in "${files[@]}"; do
    # Extract content
    body_content=$(sed -n '/<center>/,/<center>/p' "$file" | sed '1d;$d' \
      | sed 's/<th class="list" align="center">Text<\/th>//g'\
      | sed 's/eigenverantwortliches/selber/g'\
      | sed 's/Klasse(n)/Klasse/g'\
      | sed 's/Vertreter/Ersatz/g'\
      | sed 's/<td class="list" align="center">&nbsp;<\/td><\/tr>/<\/tr>/g')
    echo "$body_content" >> $output
done

# Close the body and html tags
# echo "</center>" >> $output
echo "<script src='app.js'></script>" >> $output
echo "</body>" >> $output
echo "</html>" >> $output
