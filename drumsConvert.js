// Useful functions
function whatever(val, array) {
	for (key in array) {
		if (array[key].indexOf(val) != "-1") return [key, array[key].indexOf(val)];
	}
	return false;
}

function ObjectIndexOf(elt, object) {
	i = 0;
	for (value in object) {
		if (value == elt) return i;
		i++;
	}
	return -1;
}

function INCAEOD(instrument) { // InstrumentNameContainsAnyElementOfDrums = INCAEOD, we can use it instead of "whatever" function
	i = 0;
	for (drum in drums) {
		if (instrument.contains(drum)) { return [drum, i]; }
		i++;
	}
	return false;
}

function drumsConvert() {

//Initialize basic stuff
drums = {"Acoustic Bass Drum": [2, ""], 
		"Bass Drum": [2, ""], 
		"Bass Drums": [2, ""], 
		"Side Stick": [3, ""], 
		"Snare (Acoustic)": [1, ""], 
		"Acoustic Snare": [1, ""], 
		"Electric Snare": [1, ""], 
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
		"Ride (Bell)": ["RB", ""], 
		"Bell Ride": ["RB", ""], 
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
		"Crash Cymbal": [4, ""],
		"Cymbal": [4, ""]
};
				
part_drums = [];

//Set drum's ID
for (score_part of $(xml).find("part-list score-part").toArray()) {
	attr = $(score_part)[0].attributes;
	part = attr[0].value;
	part_name = $("part-name", score_part)[0].innerHTML;
	if (ObjectIndexOf(part_name, drums) > -1 || part_name == "Drumset") { part_drums.push(part); }
	
		si = $(score_part).find("score-instrument").toArray();
		for (score_instrument of si) {
			attr2 = $(score_instrument)[0].attributes;
			name = $("instrument-name", score_instrument)[0].innerHTML;
			if (INCAEOD(name)) drums[INCAEOD(name)[0]][1] = attr2[0].value;
		}
}

tones = [];
instruments = 0;

//Read the beats
for (instrument of $(xml).find("part").toArray()) {
	//Loop through this instrument
	instruments++;
	for (measure of $(instrument).find("measure").toArray()) {
		last_x_pos = 0;
		
		//Loop through notes
		for (note of $(measure).find("note").toArray()) {
			
			if ($(note).find("instrument").length > 0) {
				attr = $(note).find("instrument")[0].attributes;
				
				if (whatever(attr[0].value, drums)) {
					//We need it
					length = $(note).find("duration")[0].innerHTML;
					attr2 = $(note)[0].attributes;
					
					//Inserting notes
					if (typeof(tones[instruments]) === "undefined") { tones[instruments] = ["", ""]; }
					
					if($(note).find("rest").length > 0) {
						//This is a rest
						//Insert
						tones[instruments][0] += 0 + "\n";
						tones[instruments][1] += length + "\n";
					}
					else {
						//Insert note
						we = whatever(attr[0].value, drums);
						
						tones[instruments][0] += drums[we[0]][0] + "\n";
						tones[instruments][1] += length + "\n";
					}
					
				}
			}
		}
	}
}

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
