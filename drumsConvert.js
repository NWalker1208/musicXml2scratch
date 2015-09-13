// Useful functions
function whatever(val, arr) {
	for (key in arr) {
		if (arr[key].indexOf(val) != "-1") return [key, arr[key].indexOf(val)];
	}
	return false;
}

function indexOf(val, obj){
	i = 0;
	for (value in obj) {
		if (value == val) return value;
		i++;
	}
	return -1;
}

String.prototype.containsAnyKeyOf = function(obj) {
	for (key in obj) {
		if (this.contains(key.toString())) return key.toString();
	}
	return -1;
}

function drumsConvert() {
	//Initialize basic stuff
	drums = {"Acoustic Bass Drum": [2, ""], 
			"Bass Drum": [2, ""], 
			"Side Stick": [3, ""], 
			"Snare (Acoustic)": [1, ""], 
			"Acoustic Snare": [1, ""], 
			"Electric Snare": [1, ""], 
											"Tom 5": [0, ""], 
			"Hi-Hat Closed": [6, ""], 
											"Tom 4": [0, ""], 
											"Hi-Hat Pedal": [0, ""], 
			"Tom 3": ["T3", ""], 
			"Hi-Hat Open": [5, ""], 
			"Open Hi-Hat": [5, ""], 
			"Closed Hi-Hat": [5, ""], 
											"Pedale Hi-Hat": [5, ""], 
			"Tom 2": ["T2", ""], 
			"Tom 1": ["T1", ""], 
			"Crash 1": [4, ""], 
											"Tom": [0, ""], 
			"Ride": ["R", ""], 
			"China": ["C", ""], 
			"Ride (Bell)": ["RB", ""], 
			"Bell Ride": ["RB", ""], 
			"Tambourine": [7, ""], 
			"Open High Conga": [14, ""], 
			"Low Conga": [14, ""], 
			"Snare Drum": [1, ""], 
			"Kick Drum": ["KD", ""], 
			"Hand Clap": [8, ""], 
			"Clap": [8, ""], 
			"Claves": [11, ""], 
			"Cowbell": [9, ""], 
			"Wood Block": [10, ""], 
			"Triangle": [12, ""], 
			"Conga": [14, ""], 
			"Guiro": [16, ""], 
			"Vibraslap": [17, ""], 
			"Open Cuica": [18, ""], 
			"Cuica": [11, ""], 
			"Closed Cuica": [11, ""], 
			"Cuica Open": [11, ""], 
			"Cuica Closed": [11, ""], 
			"Crash Cymbal": [4, ""],
			"Cymbal": [4, ""]
	};

	part_drums = [];
	
	//Set drum's ID
	$("part-list score-part", xml).each(function(index, scorePart) {
		attr = $(scorePart)[0].attributes;
		part = attr[0].value;
		part_name = $("part-name", scorePart).html();
		
		$("score-instrument instrument-name", scorePart).each(function(iIndex, instrumentName) {
			name = $(instrumentName).html();
			if (name.containsAnyKeyOf(drums) !== -1) {
				if (part_drums.indexOf(part) == -1) part_drums.push(part);
				
				id = $(instrumentName).parent().attr('id');
				realName = name.containsAnyKeyOf(drums);
				drums[realName][1] = id;
			}
		});
	});
	
	tones = [];
	instruments = 0;

	//Read the beats
	$("part", xml).each(function(iIndex, instrument) {
		//Loop through this instrument
		instruments++;
		$("measure", instrument).each(function(mIndex, measure) {
			last_x_pos = 0;
			
			//Loop through notes
			$("note", measure).each(function(nIndex, note) {
				if ($("instrument", note).length > 0) {
					attr = $("instrument", note)[0].attributes;
					
					if (whatever(attr[0].value, drums)) {
						//We need it
						length = $("duration", note).html();
						
						//Does note have attributes?
						if ($(note)[0].attributes.length > 1) {
							//Exporting attributes to variable
							attr2 = $(note)[0].attributes;
						}
						
						//Inserting notes
						if (typeof(tones[instruments]) === "undefined") { tones[instruments] = ["", ""]; }
						
						if($(note).find("rest").length > 0) {
							//This is a rest
							//Insert
							tones[instruments][0] += 0 + "\n";
							tones[instruments][1] += length + "\n";
							
							//Rest doesn't have attributes
							last_x_pos = 0;
						}
						else if(typeof(attr2) !== "undefined" && attr2["default-x"].value == last_x_pos)	{
							//Multi-beats
							we = whatever(attr[0].value, drums);
							
							//Get last element of array
							beats = tones[instruments][0].split("\n");
							lengths = tones[instruments][1].split("\n");
							
							//Insert note
							bl = beats[beats.length - 1];
							ll = lengths[lengths.length - 1];
							chr = bl == "" && ll == "" ? "" : ";";
							
							beats[beats.length - 1] = bl + chr + drums[we[0]][0];
							lengths[lengths.length - 1] = ll + chr + length;
							
							// if (typeof(tones[instruments]) === "undefined") { instruments--; } // Error fixed!
							
							tones[instruments][0] = beats.join("\n");
							tones[instruments][1] = lengths.join("\n");
						}
						else {
							//Insert note
							we = whatever(attr[0].value, drums);
							chr = tones[instruments][0].charAt(tones[instruments][0].length - 1) == "" ? "" : "\n";
							
							tones[instruments][0] += chr + drums[we[0]][0];
							tones[instruments][1] += chr + length;
						}
						
						//Set note's last x position
						if (typeof(attr2) !== "undefined") {
							last_x_pos = attr2["default-x"].value;
						} else {
							last_x_pos = 0;
						}
					} else {
						last_x_pos = 0; // ?????????????
					}
				}
			});
		});
	});
	
	//Create tmpput
	files = {};
	if (tones.length > 0) {
		// Add notes to files
		for(i = 1; i < tones.length; i++)	{
			// Add files
			instrumentsFile = "drumsInstruments" + i + ".txt";
			lengthsFile = "drumsLengths" + i + ".txt";
			
			files[instrumentsFile] = tones[i][0];
			files[lengthsFile] = tones[i][1];
		}
	}
}
