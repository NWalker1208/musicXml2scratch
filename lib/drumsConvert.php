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
																	"Hi-Hat Pedal" => array(0, ""), 
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
					"Crash Cymbal" => array(4, "")
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
		if ($score_part -> {'part-name'} == "Drumset") { $part_drums[] = $part; }
		
			foreach($score_part -> {'score-instrument'} as $score_instrument) {
				$attr2 = $score_instrument -> attributes();
				$name = $score_instrument -> {'instrument-name'};
				if (isset($drums["$name"])) $drums["$name"][1] = (string) $attr2[0];
			}
	}
	
	$tones = array();

	//Read the beats
	foreach($xml -> part as $instrument) {
		//Loop through this instrument
		$notes = -1;
		foreach($instrument -> measure as $measure)	{
			//Loop through notes
			foreach($measure -> note as $note) {
			
				if (isset($note -> instrument)) {
					$attr = $note -> instrument -> attributes();
					if (whatever($attr[0], $drums)) {
						//We need it
						$length	= (string) $note -> duration;
						$notes++;
						
						//Inserting notes
						if (count($tones) - 1 < $notes) { $tones[] = array(0 => "", 1 => ""); }
						if(isset($note -> rest)) {
							//This is a rest
							//Insert
							$tones[$notes] = array(0, $length);
							
						}
						else {
							//Insert note
							$whatever = whatever($attr[0], $drums);
							$char = strlen($tones[$notes][0]) > 0 ? ";" : "";
							$tones[$notes][0] .= $char.$drums[$whatever[0]][0];
							$tones[$notes][1] .= $char.$length;
							//$tones[$notes] = array($drums[$whatever[0]][0], $length);
						}
					}
				}
			}
		}
	}
	
	//Create tmpput
	$files = array();
	
	if (count($tones) > 0) {
		$files["instruments"] = fopen($path . "/txt/drumsInstruments.txt", "w");
		$files["lengths"] = fopen($path . "/txt/drumsLengths.txt", "w");
		
		for($i = 0; $i < count($tones); $i++)	{
			fwrite($files["instruments"], $tones[$i][0] . "\n");
			fwrite($files["lengths"], $tones[$i][1] . "\n");
		}
		
		fclose($files["instruments"]);
		fclose($files["lengths"]);
	}
?>
