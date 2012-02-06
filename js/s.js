/** --By Shon L. Burns 12/23/2011-- **/


/**  -- array sorting ----------- **/
function ascending(a,b)
{
    return a - b;
}

function descending(a,b)
{
    return b - a;
}


/* Win Scenarios used for checking for TIC TAC TOE
 * and for identifying opportunities to WIN, BLOCK
 * or STAGE
 */

var winScenarios=new Array();

winScenarios[0]="1,2,3";
winScenarios[1]="8,0,4";
winScenarios[2]="7,6,5";
winScenarios[3]="1,8,7";
winScenarios[4]="2,0,6";
winScenarios[5]="3,4,5";
winScenarios[6]="1,0,5";
winScenarios[7]="3,0,7";

/* Cell Coordinates for applying rules relatively */

var cellCoor=new Array();

cellCoor[0]="0,0";
cellCoor[1]="-1,1";
cellCoor[2]="-0,1";
cellCoor[3]="1,1";
cellCoor[4]="1,0";
cellCoor[5]="1,-1";
cellCoor[6]="0,-1";
cellCoor[7]="-1,-1";
cellCoor[8]="-1,0";


/* The human player selects either "x" or "o",
 * determining who goes first.
 */

function selMarker(markerID)
{
    $currentPlayer="x";
    $marker="#"+markerID;
    $($marker).css("background-color","#c60202");
    $($marker).css("color","white");

    if(markerID=="xMarker")
    {
        $human="x";
        $cpu="o";

        $("#turn").html("It's your turn, human [" + $human + "].");

    }else//#oMarker
        {
            $human="o";
            $cpu="x";

            $("#turn").html("My turn... Ready to lose?");
        }

    $(".marker").css("display","none");
    $("#turn").css("display","block");

    if($cpu=="x")
    {
        cpuPlayer();
    }
}

function humanPlayer(cellClicked)
{
    if($currentPlayer==$human)
    {
        //alert("human played: " + cellClicked);
        $checkCell="#cell" + cellClicked;
        if($($checkCell).text()=="")
        {
            $($checkCell).text($human);
            humanMoves.push(cellClicked);
            tictactoe($human);
        }
    }
}

function cpuPlayer()
{
    //alert("Begin cpu turn");

    var nextMoveArray=null;
    $cellToUpdate=null;

    //last moves
    $cLastMarker=$cpuPlays-1;
    $hLastMarker=$humanPlays-1;

    if(cpuMoves.length>0)
    {
        $cm=cpuMoves[$cLastMarker];
    }

    if(humanMoves.length>0)
    {
        $hm=humanMoves[$hLastMarker];
    }

    //alert("Current Player=" + $currentPlayer);
    if($currentPlayer==$cpu)
    {
    	//alert("cpu play=" + $cpuPlays );

        //stage game
    	if($cpuPlays<2)
    	{
                switch($cpuPlays)
    		{
    			case 0:
    				if($cpu=="x")
    				{
                                    //select one of the corner spaces to place marker
                                    var sendArray=new Array(1,3,5,7);
                                    $cellToUpdate=sendArray;

    				}else//$cpu=="o"
                                    {
					$cellToUpdate=obstruct($hm,$hm);
                                    }
    			break;

    			case 1:
    				if($human=="x")
    				{
                                    //check for block

                                    $cellToUpdate=nextMove("d");
                                    //alert("block=" + $cellToUpdate);

                                    if($cellToUpdate=="na")
                                    {

					$cellToUpdate=obstruct(humanMoves[0],humanMoves[1]);
                                    }

                                }else//$human=="o"
    					{
                                        	$cellToUpdate=obstruct($hm,$hm);
    					}
    			break;
    		}

		if($cellToUpdate=="na")
		{
                    //alert("random play");
                    $cellToUpdate=randomPlay();

                    if($cellToUpdate=="na")
                    {
			alert("Check the code: game stop. No cell returned.");
                    }
    		}

    	}else
    		{
    			//check for attack
    			//alert("checking for attack");
                        $cellToUpdate=nextMove("a");

    			if($cellToUpdate=="na")
    			{
    				//check for block
    				//alert("checking for block");
                                $cellToUpdate=nextMove("d");

    				if($cellToUpdate=="na")
    				{
    					//strategize
                                        //alert("checking for strategic play");
    					$cellToUpdate=strategy();

    					if($cellToUpdate=="na")
    					{
    						//random play: keep the game going
    						//alert("Random Play");
                                                $cellToUpdate=randomPlay();

    						if($cellToUpdate=="na")
    						{
    							alert("Check the code: game stop. No cell returned.");
    						}
    					}
    				}
    			}
    		}

    	//update the grid

    	if($cellToUpdate!=null && $cellToUpdate!="na")
    	{
    		//alert("sending " + $cellToUpdate + " to the updater");
                cellUpdater(selectCell($cellToUpdate));
    	}else
    		{
    			alert("Check the code: No value to send to the updater");
    		}
    }else
    	{
    		//shouldn't be here
    		alert("Error: CPU is not current player");
    	}
}

/* Updates grid with cpu plays and checks for TIC TAC TOE */
function cellUpdater(c)
{
    $theCell="#cell"+c;
    $($theCell).text($cpu);
    cpuMoves.push(c);
    tictactoe($cpu);
}

/* Functions for rotating the grid.
 * Provide start cell (a) and end cell (b) to rotate a line.
 * Plays corresponding to the slope will be returned.
 * Where a==b adjoining sides or angles will be returned.
 */

function obstruct(a,b)//returns values for play
{
	var sendArray=new Array();

        $aChecker=cellCoor[a];
        $bChecker=cellCoor[b];

        //alert("$bChecker=" + $bChecker);

        var aC=$aChecker.split(",");
        var bC=$bChecker.split(",");

        //alert("aX=" + aC[0]);
        //alert("aY" + aC[1]);

        //get x and y for both points

        $aX=parseInt(aC[0]);
        $aY=parseInt(aC[1]);

        $bX=parseInt(bC[0]);
        $bY=parseInt(bC[1]);

	if(a==b)
	{
		if(a==0)
		{
			sendArray.push(1,3,5,7)
		}else
			{
	            if(a%2==0)//a is a side: return center or corners on opposite side
	            {
	                if($("#cell0").text()=="")
	                {
	                    sendArray.push(0);
	                }else
	                    {
	                         //alert("a is a side");
	                        for($s=0;$s<9;$s++)
	                        {
	                            var checkCoor=cellCoor[$s].split(",");

	                            if($aX==0)
	                            {
	                                //return corner where y=-$aY
	                                if($s%2>0 && checkCoor[1]==-$aY)
	                                {
                                    sendArray.push($s);
                                }

                            }else//$aY==0
                                {
                                    //return corners where x=-$aX
                                    if($s%2>0 && checkCoor[0]==-$aX)
                                    {
                                        sendArray.push($s);
                                    }
                                }
                        }
                    }

            }else//a is a corner: return the center
                    {
	                   	if($("#cell0").text()=="")
	                   	{
	                   		sendArray.push(0);
	                   	}else
	                   		{
	                   			sendArray.push(1,3,5,7);
	                   		}
                    }

			}

	}else //rules for lines
		{
			//both points on a side
			if(a%2==0 && b%2==0)
			{
				//alert("both points on a side");

                                // lines running thru 0
				if($aX==$bX || $aY==$bY)
				{
					//return 0 and all corners;
					sendArray.push(0,1,3,5,7);
                                        //sendArray.push(0,2,4,6,8);

				}else//two points with corner between
					{
						//send all points except corner inbetween and it's inverse

						$checkPoint1=($aX==0)?$bX:$aX;
						$checkPoint2=($aY==0)?$bY:$aY;

						$includePoint1=$checkPoint1 +"," + $checkPoint2;

						for($s=0;$s<9;$s++)
						{
							$checkCell=cellCoor[$s];
							$theCell="#cell"+$s;
							if($checkCell==$includePoint1)
							{
								if($($theCell).text()=="")
								{
									sendArray.push($s);
								}else
									{
										$excludeCell=(-1*$checkPoint1)+","+(-1*checkPoint2)
										if($checkCell!=$excludeCell)
										{
											sendArray.push($s);
										}
									}

							}
						}

					}

			}else
				{
                                        //both points on a corner
                                        //alert("both points on a corner");
					if(a%2>0 && b%2>0)
					{
                                                //both points on the same side
						if($aX==$bX || $aY==$bY)
						{
							//return 0 and all corners
							sendArray.push(0,1,3,5,7)
						}else
							{
								//points on diagnal crossing 0
								sendArray.push(0,2,4,6,8);
							}
					}else//a point on a corner and a point in the center
						{
                             if(a==0||b==0)
                             {
                             	sendArray.push(1,3,5,7);

                             }else//a point on a side and a point on a corner
                             	{
									//alert("points on a corner and a side");
                                                    if($("#cell0").text()=="")
                                                    {
                                                        sendArray.push(0);
                                                    }else
                                                        {
                                                            //find corner and return where the two empty sides
                                                            if(a%2>0)//a is the corner
                                                            {
                                                                for($s=0;$s<9;$s++)
                                                                {
                                                                    $checker=cellCoor[$s].split(",");

                                                                    if($aY==$bX)//return all y where =$aY
                                                                    {
                                                                        if($checker[1]==$aY)
                                                                        {
                                                                            sendArray.push($s);
                                                                        }
                                                                    }else//return all x where =$aX
                                                                        {
                                                                            if($checker[0]==$aX)
                                                                            {
                                                                                sendArray.push($s);
                                                                            }
                                                                        }
                                                                }

                                                            }else//b is the corner
                                                                {
                                                                    for($s=0;$s<9;$s++)
                                                                    {
                                                                        $checker=cellCoor[$s].split(",");

                                                                        if($bY==$aX)//return all y where =$bY
                                                                        {
                                                                            if($checker[1]==$bY)
                                                                            {
                                                                                sendArray.push($s);
                                                                            }
                                                                        }else//return all x where =$bX
                                                                            {
                                                                                if($checker[0]==$bX)
                                                                                {
                                                                                    sendArray.push($s);
                                                                                }
                                                                            }
                                                                    }
                                                                }
                                                        }
                                                    }
						}
				}
		}

	if(sendArray && sendArray.length>0)
	{
		//alert("obstruct:" + sendArray)
                return sendArray;
	}else
		{
			return "na";
		}
}



/* Handles offense and defense*/

function nextMove(moveType) //"a"=offense; "d"=defense
{
    $playChecker=0;
    $checkPlayer = (moveType == "a") ? $cpu : $human; //check for attack or block

    var nextMoveArray=null;
    nextMoveArray=new Array();

    //scan win scenarios
    for($g=0;$g<winScenarios.length;$g++)
    {

        var checkScenario=winScenarios[$g].split(",");

        //alert(checkScenario[0]);

        $p1="#cell"+checkScenario[0];
        $p2="#cell"+checkScenario[1];
        $p3="#cell"+checkScenario[2];

        if($($p1).text()==$checkPlayer && ($($p2).text()=="" || $($p3).text()==""))
        {
            $captureCell = ($($p2).text()=="") ? checkScenario[2] : checkScenario[1];
            $playChecker++;
        }

        if($($p2).text()==$checkPlayer && ($($p1).text()=="" || $($p3).text()==""))
        {
            $captureCell = ($($p1).text()=="") ? checkScenario[0] : checkScenario[2];
            $playChecker++;
        }

        if($($p3).text()==$checkPlayer && ($($p2).text()=="" || $($p1).text()==""))
        {
            $captureCell = ($($p2).text()=="") ? checkScenario[1] : checkScenario[0];
            $playChecker++;
        }

        if($playChecker==2)
        {
            nextMoveArray.push($captureCell);
        }

        $playChecker=0;
    }

    if(nextMoveArray && nextMoveArray.length>0)
    {
        return nextMoveArray;
    }else
        {
            return "na";
        }
}

/* If no attack or block is available look for opportunity to win */

function strategy()
{

    //alert("I am here")
    $checker=0;
    var winOpty=null;

    if($("#cell0").text()=="")
    {
    	winOpty=new Array();
        winOpty.push(0);
    }else
        {
            //scan win scenarios
            for($s=0;$s<winScenarios.length;$s++)
            {
                var checkScenario=winScenarios[$s].split(",");

		$p1="#cell"+checkScenario[0];
		$p2="#cell"+checkScenario[1];
		$p3="#cell"+checkScenario[2];

                $t1=($($p1).text()==$cpu) ? 1 : 0;
                $t2=($($p2).text()==$cpu) ? 1 : 0;
                $t3=($($p1).text()==$cpu) ? 1 : 0;


                //check for win opportunities
                if(($t1+$t2+$t3)==2)
                {
                    winOpty=new Array();

                    if($t1==0)
                    {
                        winOpty.push(checkScenario[0]);
                    }

                    if($t2==0)
                    {
                        winOpty.push(checkScenario[1]);
                    }

                    if($t3==0)
                    {
                        winOpty.push(checkScenario[2]);
                    }
                }
            }
        }

    //alert("winopty=" + winOpty);

    if(winOpty && winOpty.length>0)
    {
       return selectCell(winOpty);
    }else
        {
            winOpty=null;
            winOpty=new Array();

            for($s=0;$s<9;$s++)
            {
                if($s%2>0)
                {
                    $theCorner="#cell"+$s;
                    if($($theCorner).text()=="")
                    {
                        $leftSide="#cell" + pointFinder($s,1,"s");
                        $rightSide="#cell" + pointFinder($s,1,"a");

                        if($($leftSide).text()==$human && $($rightSide).text()==$human)
                        {
                            winOpty.push($s);
                        }
                    }
                }
            }

            if(winOpty && winOpty.length>0)
            {
                return selectCell(winOpty)
            }else
                {
                    return "na";
                }
        }
}

function pointFinder(p,o,m)// p=startpoint; o=offset;m=addition or subtraction
{
    //angle to side, offset=1; angle to angle or side to side, offset=2

    if(m=="a")//addition: find side or angle to the right
    {
        if(p+o>8)
        {
            return (p+o)-8;
        }else
            {
                return p+o;
            }
    }else//subtraction: find side or angle to the left
        {
            if(p-o<0)
            {
                return (p-o)+8;
            }else
                {
                    return p-o;
                }
        }
}

//returns a cell for updating from all available cells
function randomPlay()
{
    var nextMoveArray=null;
    nextMoveArray=new Array();

    for($r=0;$r<9;$r++)
    {
        $sel="#cell"+$r;

        if($($sel).text()=="")
        {
            nextMoveArray.push($r);
        }
    }

    if(nextMoveArray && nextMoveArray.length>0)
    {
    	return nextMoveArray;
    }else
    	{
    		//serious problem
    		//alert("Random Play not sent")
                return "na";
    	}
}


//returns the available cell for updating from a collection

function selectCell(a)
{
    var sel=jQuery.makeArray(a);
    var collector=new Array();

    for($s=0;$s<sel.length;$s++)
    {
        $checker="#cell"+sel[$s];

        //alert("selectCell=" + $checker);

        if($($checker).text()=="")
        {
            collector.push(sel[$s]);
        }
    }

    if(collector && collector.length>0)
    {
        return collector[Math.floor(Math.random()*collector.length)];
    }else
        {
            return "na";
        }
}

function resetGame()
{
    $cpu="";
    $human="";
    $currentPlayer="none";

    $cpuPlays=0;
    $humanPlays=0;

    cpuMoves=null;
    cpuMoves=new Array();

    humanMoves=null;
    humanMoves=new Array();

    $("#total").text($cpuWins+$cpuLosses+$ties);

    for($x=0;$x<9;$x++)
    {
        $clearcell="#cell"+$x;
        $($clearcell).html("");
        $($clearcell).css("background-color","black");
    }

    $(".marker").css("display","block");
    $("#turn").css("display","none");

    $("#xMarker").css("display","block");
    $("#oMarker").css("display","block");
    $("#xMarker").css("background-color","white");
    $("#oMarker").css("background-color","white");
    $("#xMarker").css("color","black");
    $("#oMarker").css("color","black");
}

    function tictactoe(checkWinner)//$cpu or $human
    {

        //alert("checking for tic tac toe");
        $tttChecker=0;

        var winArray=null;
        winArray=new Array();

        for($g=0;$g<winScenarios.length;$g++)
        {
            var checkWin=winScenarios[$g].split(",");

            $p1="#cell"+checkWin[0];
            $p2="#cell"+checkWin[1];
            $p3="#cell"+checkWin[2];

            //check for tic tac toe

            if($($p1).text()==checkWinner)
            {
                $tttChecker++;
            }

            if($($p2).text()==checkWinner)
            {
                $tttChecker++;
            }

            if($($p3).text()==checkWinner)
            {
                $tttChecker++;
            }

            if($tttChecker==3)
            {
                winArray.push(winScenarios[$g]);
            }

            $tttChecker=0;
        }

        if(winArray && winArray.length>0)
        {
            //tic tac toe winner

            var theWin=winArray[0].split(",");

            //alert(theWin[0]);

            $hl1="#cell"+theWin[0];
            $hl2="#cell"+theWin[1];
            $hl3="#cell"+theWin[2];

            $($hl1).css("background-color","#c60202");
            $($hl1).css("color","white");

            $($hl2).css("background-color","#c60202");
            $($hl2).css("color","white");

            $($hl3).css("background-color","#c60202");
            $($hl3).css("color","white");

            if(checkWinner==$cpu)
            {
                $cpuWins++;
                $humanLosses++;
                $("#cpuWins").html($cpuWins);
                $("#humanLosses").html($humanLosses);
                $("#turn").html("You Lose!!");
                $tttmsg="trashTalk(\"I WIN!!! Let's play again.\",\"TIC TAC TOE!!!\")";
            }else
            {
                $humanWins++;
                $cpuLosses++;
                $("#humanWins").html($humanWins);
                $("#cpuLosses").html($cpuLosses);
                $("#turn").html("Lucky you...");
                $tttmsg="trashTalk(\"LUCK... Let's play again.\",\"TIC TAC TOE!!!\")";
            }

            setTimeout($tttmsg,2000);

        }else//check for tie
        {
            $catGame=0;

            for($grid=0;$grid<9;$grid++)
            {
                $checkValue="#cell"+$grid;
                if($($checkValue).text()!="")
                {
                    $catGame++;
                }
            }

            if($catGame==8)
            {

                //update empty cell

                    for($e=0;$e<9;$e++)
                    {
                        $emptyCell="#cell"+$e;
                        if($($emptyCell).text()=="")
                        {
                            $($emptyCell).text("x");
                        }
                    }


                $ties++;

                $("#ties").text($ties);
                $("#turn").html("A tie... You still didn't win!");
                $tttmsg="trashTalk(\"A tie is not a win --Ha! Let's play again.\",\"Cat's Eye!!!\")";
                setTimeout($tttmsg,2000);
            }else
            {
                //continue play
                if(checkWinner==$cpu)
                {
                    $cpuPlays++;
                    $currentPlayer=$human;
                    $("#turn").html("Your turn, human (" + $human + ").")
                }else
                {
                    $humanPlays++;
                    $currentPlayer=$cpu;
                    $("#turn").html("My turn... ready to lose?")
                    cpuPlayer();
                }
            }
        }
    }

    function trashTalk(t,m)
    {
        jAlert(t,m);
        setTimeout("resetGame()",2000);
    }

