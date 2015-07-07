function whatever(val, array) {
	for (key in array) {
		if (array[key].indexOf(val) != "-1") return [key, array[key].indexOf(val)];
	}
	return false;
}

function drumsConvert() {

//Initialize basic stuff
drums = {"Acoustic Bass Drum": [2, ""], 
		"Bass Drum": [2, ""], 
		"Side Stick": [3, ""], 
		"Snare (Acoustic]": [1, ""], 
		"Snare (Electric]": [1, ""], 
										"Tom 5": [0, ""], 
		"Hi-Hat Closed": [6, ""], 
		//"Tom 4": [0, ""], 
										"Hi-Hat Pedal": [0, ""], 
		"Tom 3": ["T3", ""], 
		"Hi-Hat Open": [5, ""], 
		"Tom 2": ["T2", ""], 
		"Tom 1": ["T1", ""], 
		"Crash 1": [4, ""], 
										"Tom": [0, ""], 
		"Ride": ["R", ""], 
		"China": ["C", ""], 
		"Ride (Bell]": ["RB", ""], 
		"Tambourine": [7, ""], 
		"open high conga": [14, ""], 
		"low conga": [14, ""], 
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
		"Crash Cymbal": [4, ""]
};
				
part_drums = [];

//Set drum's ID
for (score_part of $(xml).find("part-list score-part").toArray()) {
	attr = $(score_part)[0].attributes;
	part = attr[0].value;
	if ($("part-name", score_part)[0].innerHTML == "Drumset") { part_drums.push(part); }
	
		si = $(score_part).find("score-instrument").toArray();
		for (score_instrument of si) {
			attr2 = $(score_instrument)[0].attributes;
			name = $("instrument-name", score_instrument)[0].innerHTML;
			if (typeof(drums[name]) !== "undefined") drums[name][1] = attr2[0].value;
		}
}

tones = [];

//Read the beats
for (instrument of $(xml).find("part").toArray()) {
	//Loop through this instrument
	notes = -1;
	for (measure of $(instrument).find("measure").toArray()) {
		//Loop through notes
		for (note of $(measure).find("note").toArray()) {
			
			if ($(note).find("instrument").length > 0) {
				attr = $(note).find("instrument")[0].attributes;
				if (whatever(attr[0], drums)) {
					//We need it
					length = $(note).find("duration")[0].innerHTML;
					notes++;
					
					//Inserting notes
					if (tones.length - 1 < notes) { tones.push(["",""]); }
					if($(note).find("rest").length > 0) {
						//This is a rest
						//Insert
						tones[notes] = [0, length];
					}
					else {
						//Insert note
						whatever = whatever(attr[0].value, drums);
						chr = tones[notes][0].length > 0 ? ";" : "";
						tones[notes][0] += chr.drums[whatever[0]][0];
						tones[notes][1] += chr.length;
						//tones[notes] = [drums[whatever[0]][0], length];
					}
				}
			}
		}
	}
}


//Create tmpput
files = {};
if (tones.length > 0) {
	// Add files if don't exist
	instrumentsFile = "drumsInstruments.txt";
	lengthsFile = "drumsLengths.txt";
	if (typeof(files[instrumentsFile]) === "undefined") { files[instrumentsFile] = ""; }
	if (typeof(files[lengthsFile]) === "undefined") { files[lengthsFile] = ""; }
	
	// Add notes to files
	for(i = 0; i < tones.length; i++)	{
		file[instrumentsFile] = tones[i][0] + "\n";
	}
}

}
