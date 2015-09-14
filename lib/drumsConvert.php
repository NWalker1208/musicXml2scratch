<?php
	//Initialize basic stuff
	$drums = array("Acoustic Bass Drum" => array(2, ""), 
					"Bass Drum" => array(2, ""), 
					"Side Stick" => array(3, ""), 
					"Snare (Acoustic)" => array(1, ""), 
					"Snare (Electric)" => array(1, ""), 
																	"Tom 5" => array(0, ""), 
					"Hi-Hat Closed" => array(6, ""), 
					//"Tom 4" => array(0, ""), 
																	"Hi-Hat Pedal" => array(5, ""), 
																	"Pedale Hi-Hat" => array(5, ""), 
					"Tom 3" => array("T3", ""), 
					"Hi-Hat Open" => array(5, ""), 
					"Tom 2" => array("T2", ""), 
					"Tom 1" => array("T1", ""), 
					"Crash 1" => array(4, ""), 
																	"Tom" => array(0, ""), 
					"Ride" => array("R", ""), 
					"China" => array("C", ""), 
					"Ride (Bell)" => array("RB", ""), 
					"Tambourine" => array(7, ""), 
					"open high conga" => array(14, ""), 
					"low conga" => array(14, ""), 
					"Snare Drum" => array(1, ""), 
					"Kick Drum" => array("KD", ""), 
					"Hand Clap" => array(8, ""), 
					"Clap" => array(8, ""), 
					"Claves" => array(11, ""), 
					"Cowbell" => array(9, ""), 
					"Wood Block" => array(10, ""), 
					"Triangle" => array(12, ""), 
					"Conga" => array(14, ""), 
					"Guiro" => array(16, ""), 
					"Vibraslap" => array(17, ""), 
					"Open Cuica" => array(18, ""), 
					"Cuica" => array(11, ""), 
					"Closed Cuica" => array(11, ""), 
					"Cuica Open" => array(11, ""), 
					"Cuica Closed" => array(11, ""), 
					"Crash Cymbal" => array(4, ""),
					"Bass Drums" => array(0, "")
					);
					
	$part_drums = array();
					
	function whatever($val, $array) {
	$keys = array_keys($array);
	
	foreach ($keys as $key)
		if (in_array($val, $array[$key]))
			return array($key, array_search($val, $array[$key]));
	return false;
	}
	
	//Load musicXML file
	$xml = simplexml_load_string($contents);
	if(!isset($xml -> {'part-list'})) {
		die("Invalid file");
	}

	//Set drum's ID
	foreach($xml -> {'part-list'} -> {'score-part'} as $score_part) {
		$attr = $score_part -> attributes();
		$part = $attr[0];
		
			foreach($score_part -> {'score-instrument'} as $score_instrument) {
				$attr2 = $score_instrument -> attributes();
				$name = $score_instrument -> {'instrument-name'};
				if (isset($drums["$name"])) $drums["$name"][1] = (string) $attr2[0];
				
				if (!in_array($part, $part_drums)) { $part_drums[] = $part; }
			}
	}
	
	$tones = array();
	$instruments = 0;

	//Read the beats
	foreach($xml -> part as $instrument) {
		//Loop through this instrument
		$instruments++;
		foreach($instrument -> measure as $measure)	{
			$last_x_pos = 0;
			
			//Loop through notes
			foreach($measure -> note as $note) {
			
				if (isset($note -> instrument)) {
					$attr = $note -> instrument -> attributes();
					if (whatever($attr[0], $drums)) {
						//We need it
						$length	= (string) $note -> duration;
						
						//Does note have attributes?
						if ($note -> attributes() -> count() > 1) {
							//Exporting attributes to variable
							$attr2 = $note -> attributes();
						}
						
						//Inserting notes
						if (!isset($tones[$instruments])) { $tones[$instruments] = array("", ""); }
						
						if(isset($note -> rest)) {
							//This is a rest
							//Insert
							$tones[$instruments][0] .= 0 + "\n";
							$tones[$instruments][1] .= $length + "\n";
							
							//Rest diesn't have attributes
							$last_x_pos = 0;
						}
						elseif(isset($attr2) && floatval($attr2[0]) == floatval($last_x_pos))	{
							//Multi-beats
							$whatever = whatever($attr[0], $drums);
							
							//Get last element of array
							$beats = explode("\n", $tones[$instruments][0]);
							$lengths = explode("\n", $tones[$instruments][1]);
							
							//Insert note
							$bl = $beats[count($beats) - 1];
							$ll = $lengths[count($lengths) - 1];
							$char = $bl == "" && $ll == "" ? "" : ";";
							
							$beats[count($beats) - 1] = $bl + $char + $drums[$whatever[0]][0];
							$lengths[count($lengths) - 1] = $ll + $char + $length;
							
							$tones[$instruments][0] = implode("\n", $beats);
							$tones[$instruments][1] = implode("\n", $lengths);
						}
						else {
							//Insert note
							if (!isset($tones[$instruments][0])) { $tones[$instruments][0] = ""; } // Bug fixed!
							$whatever = whatever($attr[0], $drums);
							$ti = $tones[$instruments][0];
							$char = count($ti) - 1 == 0 || $ti[count($ti) - 1] == "" ? "" : "\n";
							
							$tones[$instruments][0] .= $char.$drums[$whatever[0]][0];
							$tones[$instruments][1] .= $char.$length;
							//$tones[$notes] = array($drums[$whatever[0]][0], $length);
						}
						
						if (isset($attr2)) {
							$last_x_pos = $attr2[0];
						} else {
							$last_x_pos = 0;
						}
					} else {
						$last_x_pos = 0;
					}
				}
			}
		}
	}
	
	//Create tmpput
	$files = array();
	$drums_fileName = array();
	
	if (count($tones) > 0) {
		//Add notes to files
		for ($i = 1; $i < count($tones); $i++) {
			//Add files
			$instrumentsFile = "drumsInstruments" + $i + ".txt";
			$lengthsFile = "drumsLengths" + $i + ".txt";
			
			$drums_fileName[] = $instrumentsFile;
			$drums_fileName[] = $lengthsFile;
			
			$files["instruments"] = fopen($path . "/txt/$instrumentsFile", "w");
			$files["lengths"] = fopen($path . "/txt/$lengthsFile", "w");
			
			fwrite($files["instruments"], $tones[$i][0]);
			fwrite($files["lengths"], $tones[$i][1]);
			
			fclose($files["instruments"]);
			fclose($files["lengths"]);
		}
	}
?>
