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

part = $("part", xml).toArray();

for (partValue of part) {
	id = $(partValue).attr("id");
	
	if (typeof(part_drums) !== "undefined" && part_drums.indexOf(id) == "-1" || typeof(part_drums) === "undefined") {
		instruments++;
		// We need to create some elements manually.
		if (typeof(tones[instruments]) === "undefined") { tones[instruments] = []; }
		
		measure = $("measure", partValue).toArray();
		for (measureValue of measure) {
			last_x_pos = 0;
			last_staff = 1;
			
			note = $("note", measure).toArray();
			for (noteValue of note) {
				instrument = typeof($(noteValue).find("instrument")[0]) == "undefined" ? "Piano" : $(noteValue).find("instrument")[0].attributes[0].value;
				
				if (!whatever(instrument, drums)) {
					length = $("duration", noteValue)[0].innerHTML;
					staff = ($("staff", noteValue).length > 0) ? $("staff", noteValue)[0].innerHTML : 1;
					if (last_staff !== staff) { last_x_pos = 0; last_staff = staff; } // If in one measure are 2 staffs
					
					//Check if note exists
					if ($("pitch", noteValue).length > 0) {
						step = $("pitch step", noteValue)[0].innerHTML;
						alter = ($("pitch alter", noteValue).length > 0) ? $("pitch alter", noteValue)[0].innerHTML : "0";
						value = $("pitch octave", noteValue)[0].innerHTML * 12 + t[step] + Number(alter);
						
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
						else if(typeof(attr) && attr[0].value == last_x_pos)	{
							//Multi-notes
							//Get last element of array
							lp = typeof(tones[instruments][staff]) ? tones[instruments][staff].length - 1 : 0;
							
							//Insert note
							tmp_array = [value, length, step, $("pitch octave", noteValue)[0].innerHTML];
							if (typeof(tones[instruments]) === "undefined") { instruments--; } // Error fixed!
							length = tones[instruments][staff][lp].length;
							for (i = 0; i < length; i++) {
								tones[instruments][staff][lp][i] = tones[instruments][staff][lp][i] + ";" + tmp_array[i];
							}
						}
						else if($("pitch", noteValue).length > 0) {
							//Insert note
							tones[instruments][staff].push([value, length, step, $("pitch octave", noteValue)[0].innerHTML]);
						}
						
						//Set note's last x position
						if (typeof(attr) !== undefined) {
							last_x_pos = attr[0].value;
						} else {
							last_x_pos = 0;
						}
					}
				}
			}
		}
	}
}

//Create tmpput
// files = {};
for (i = 1; i < instruments; i++) {
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
