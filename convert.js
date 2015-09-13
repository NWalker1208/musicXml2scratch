function convert() {
	t = {
		"C": 0,
		"D": 2,
		"E": 4,
		"F": 5,
		"G": 7,
		"A": 9,
		"B": 11,
	};
	tones = [];
	instruments = 0;
	$("part", xml).each(function(partIndex, partValue) {
		id = $(partValue).attr("id");
		
		if (typeof(part_drums) !== "undefined" && part_drums.indexOf(id) == "-1" || typeof(part_drums) === "undefined") {
			instruments++;
			// We need to create some elements manually.
			if (typeof(tones[instruments]) === "undefined") { tones[instruments] = []; }
			
			$("measure", partValue).each(function(measureIndex, measureValue) {
				last_x_pos = 0;
				last_staff = 1;
				
				$("note", measureValue).each(function(noteIndex, noteValue) {
					// We need it
					length = $("duration", noteValue).html();
					staff = ($("staff", noteValue).length > 0) ? $("staff", noteValue).html() : 1;
					if (last_staff !== staff) { last_x_pos = 0; last_staff = staff; } // If in one measure are 2 staffs
					
					//Check if note exists
					if ($("pitch", noteValue).length > 0) {
						// This is a note
						step = $("pitch step", noteValue).html();
						alter = ($("pitch alter", noteValue).length > 0) ? $("pitch alter", noteValue).html() : "0";
						value = Number($("pitch octave", noteValue).html()) * 12 + Number(t[step]) + Number(alter);
						
						//Does note have attributes?
						if ($(noteValue)[0].attributes.length > 1) {
							//Exporting attributes to variable
							attr = $(noteValue)[0].attributes;
						}
						
						// We need to create some elements manually.
						if (typeof(tones[instruments][staff]) === "undefined") { tones[instruments][staff] = []; }
						
						//Inserting notes
						if($("rest", noteValue).length > 0) {
							//This is a rest
							//Insert
							tones[instruments][staff].push([0, length]);
							
							//Rest doesn't have attributes
							last_x_pos = 0;
						}
						else if(typeof(attr) !== "undefined" && attr[0].value == last_x_pos)	{
							//Multi-notes
							//Get last element of array
							lp = typeof(tones[instruments][staff]) !== "undefined" ? tones[instruments][staff].length - 1 : 0;
							
							//Insert note
							tmp_array = [value, length, step, $("pitch octave", noteValue).html()];
							if (typeof(tones[instruments]) === "undefined") { instruments--; } // Error fixed!
							length = tones[instruments][staff][lp].length;
							for (i = 0; i < length; i++) {
								tones[instruments][staff][lp][i] = tones[instruments][staff][lp][i] + ";" + tmp_array[i];
							}
						}
						else if($("pitch", noteValue).length > 0) {
							//Insert note
							tones[instruments][staff].push([value, length, step, $("pitch octave", noteValue).html()]);
						}
						
						//Set note's last x position
						if (typeof(attr) !== "undefined") {
							last_x_pos = attr["default-x"].value;
						} else {
							last_x_pos = 0;
						}
					}
				});
			});
		}
	});
	//Create tmpput
	// files = {};
	for (i = 1; i <= instruments; i++) {
		for (x = 1; x < tones[i].length; x++) {
			// Add files if don't exist
			valuesFile = "values" + i + "hand" + x + ".txt";
			lengthsFile = "lengths" + i + "hand" + x + ".txt";
			if (typeof(files[valuesFile]) === "undefined") { files[valuesFile] = ""; }
			if (typeof(files[lengthsFile]) === "undefined") { files[lengthsFile] = ""; }
			
			// Add notes to files
			currentTones = tones[i][x];
			
			for (value of currentTones) {
				files[valuesFile] += value[0] + "\n";
				files[lengthsFile] += value[1] + "\n";
			}
		}
	}

	//Zip file
	var zip = new JSZip();

	for (index in files) {
		zip.file(index, files[index]);
	}

	if (typeof(files["drumsInstruments.txt"]) !== "undefined") {
		zip.file("drumsInstruments.txt", files["drumsInstruments.txt"]);
		zip.file("drumsLengths.txt", files["drumsLengths.txt"]);
	}

	var content = zip.generate({type:"blob"});
	saveAs(content, "lists.zip");
}
