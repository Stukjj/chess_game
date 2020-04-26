class Chessboard {

    constructor( ) {

        this.config = "rnbqkbnr/pppppppp/________/___K_q__/________/________/PPPPPPPP/RNBQ_BNR w 0"; 
        // min = black
        // MAJ = white
        // second last: specifies whose turn
        // last digit: 0: ntg clicked | 1: stg clicked
        // start = "rnbqkbnr/pppppppp/________/________/________/________/PPPPPPPP/RNBQKBNR w 0"
        this.clicked;
        this.moves;
        // position of the black king
        this.bK = "e8";
        // position of the white king
        this.wK = "e1";

    }

    // return the piece inside the cell given
    getPieceByCellId( cellId ) {

        let cell = document.getElementById( cellId );
        return cell.innerHTML.substring( cell.innerHTML.length - 8, cell.innerHTML.length - 6 )

    }

    // return the index of the cell in the config
    getIndexOfCell( cell ) {

        let count = 0, j = 0;
        while ( count < ( 8 - cell[1] ) ) {
            if ( this.config[j] == '/' )
                count += 1;
            j += 1;
        }
        j += cell[0].charCodeAt( 0 ) - 97;
        return j;

    }

    // reset the board
    reset( ) {

        let td = document.getElementsByClassName( "unclicked" );
        let tdClick = document.getElementsByClassName( "clicked" );
        for ( let i of td ) {
            i.innerHTML = "";
        }
        if ( tdClick.length > 0 )
            tdClick[0].innerHTML = "";

    }

    // place all the pieces depending on the config attribute
    placePieces( ) {

        let row = 0, col = 0;
        let img, td;
        let h = document.getElementsByTagName( 'h2' );
        console.log( document );
        h[0].innerHTML = ( this.config[ this.config.length - 3 ] == 'w' ? "White" : "Black" ) + " turn.";

        this.reset( );
        for ( let i of this.config ) { // loop on the config attrbute
            if ( i == ' ' )
                break;
            img = document.createElement ( 'img' );
            if ( i.charCodeAt( 0 ) == 47 ) { // next row and reset col at -1 because it increase at the end of this loop
                row += 1; 
                col = -1;
            }
            else if ( i != '_' ) { 
                td = document.getElementById( String( String.fromCharCode( 97 + col ) + ( 8 - row ) ) ); // get the right cell on the board
                if ( i.charCodeAt( 0 ) <= 90 && i.charCodeAt( 0 ) >= 65 ) // MAJ = white 
                    img.src = 'img/w' + i.toUpperCase( ) + '.png';
                if ( i.charCodeAt( 0 ) <= 122 && i.charCodeAt( 0 ) >= 97 ) // min = black
                    img.src = 'img/b' + i.toUpperCase( ) + '.png';
                td.appendChild( img );
            }
            col += 1;
        }

    }

    // return a list of cells where the piece can move
    allowedMoves( cellId ) {

        // The Queen moves are the same as Rook and Bishop so we don't need a special treatment for them
        let dirPawn, moveCol, moveRow, prevCol, prevRow;
        let res = [];
        let piece = this.getPieceByCellId( cellId );
        
        // Pawn 
        if ( piece[1] == 'P' ) {
            // single direction for the pawn, depends on its color
            if ( piece[0] == 'w' )
                dirPawn = 1;
            else
                dirPawn = -1

            // first: click if the move is inbound | second: click if the first cell it encounters is empty
            if ( parseInt( cellId[1] ) + dirPawn <= 8 && parseInt( cellId[1] ) + dirPawn >= 1 && document.getElementById( cellId[0] + String( parseInt( cellId[1] ) + dirPawn ) ).innerHTML == "" ) {
                res.push( cellId[0] + String( parseInt( cellId[1] ) + dirPawn ) );
                // click if the second cell is empty only if the pawn didn't move yet
                if ( ( ( piece[0] == 'w' && cellId[1] == 2 ) || ( piece[0] == 'b' && cellId[1] == 7 ) ) && document.getElementById( cellId[0] + String( parseInt( cellId[1] ) + dirPawn*2 ) ).innerHTML == "" )
                    res.push( cellId[0] + String( parseInt( cellId[1] ) + dirPawn*2 ) );
            }

            moveCol = parseInt( cellId[1] ) + dirPawn;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) + dirPawn );
            // first: click if the move is inbound | second: click if the cell is free or occupied by a piece of the opposite color | same logic for the next move
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML != "" && 
                    ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) )
                res.push( moveRow + moveCol );
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) - dirPawn );
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML != "" && 
                ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) )
            res.push( moveRow + moveCol );
        }

        // Rook and Queen
        if ( piece[1] == 'R' || piece[1] == 'Q' ) {

            // top col
            moveCol = parseInt( cellId[1] ) + 1;
            // first: click if the move is inbound | second: click if the cell is free or occupied by a piece of the opposite color, loop | third: click if before the pieces encountered there was stg | same logic for the next moves
            while ( moveCol <= 8 && moveCol >= 1 && ( document.getElementById( cellId[0] + String( moveCol ) ).innerHTML == "" || 
                    this.getPieceByCellId( document.getElementById( cellId[0] + String( moveCol ) ).id )[0] != piece[0] ) && 
                    ( prevCol == undefined || document.getElementById( cellId[0] + String( prevCol ) ).innerHTML == "" ) ) {
                res.push( cellId[0] + moveCol );
                prevCol = moveCol;
                moveCol += 1;
            }

            // bottom col
            prevCol = undefined;
            moveCol = parseInt( cellId[1] ) - 1;
            while ( moveCol <= 8 && moveCol >= 1 && ( document.getElementById( cellId[0] + String( moveCol ) ).innerHTML == "" || 
                    this.getPieceByCellId( document.getElementById( cellId[0] + String( moveCol ) ).id )[0] != piece[0] ) && 
                    ( prevCol == undefined || document.getElementById( cellId[0] + String( prevCol ) ).innerHTML == "" ) ) {
                res.push( cellId[0] + moveCol );
                prevCol = moveCol;
                moveCol -= 1;
            }

            // right row
            prevCol = undefined;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) + 1 );
            while ( moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + cellId[1] ).innerHTML == "" || 
                    this.getPieceByCellId( document.getElementById( moveRow + cellId[1] ).id )[0] != piece[0] ) && 
                    ( prevRow == undefined || document.getElementById( prevRow + cellId[1] ).innerHTML == "" ) ) {
                res.push( moveRow + cellId[1] );
                prevRow = moveRow;
                moveRow = String.fromCharCode( moveRow.charCodeAt( 0 ) + 1 );
            }

            //left row
            prevRow = undefined;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) - 1 );
            while ( moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + cellId[1] ).innerHTML == "" || 
                    this.getPieceByCellId( document.getElementById( moveRow + cellId[1] ).id )[0] != piece[0] ) && 
                    ( prevRow == undefined || document.getElementById( prevRow + cellId[1] ).innerHTML == "" ) ) {
                res.push( moveRow + cellId[1] );
                prevRow = moveRow;
                moveRow = String.fromCharCode( moveRow.charCodeAt( 0 ) - 1 );
            }
        }

        // Knight
        if ( piece[1] == 'N' ) {

            // top right move
            moveCol = parseInt( cellId[1] ) + 2;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) + 1 );
            // first: click if the move is inbound | second: click if the cell is free or occupied by a piece of the opposite color | same logic for the next moves
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + moveCol );
            }

            // right top move
            moveCol = parseInt( cellId[1] ) + 1;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) + 2 );
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + moveCol );
            }

            // right bottom move
            moveCol = parseInt( cellId[1] ) - 1;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) + 2 );
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + moveCol );
            }

            // bottom right move
            moveCol = parseInt( cellId[1] ) - 2;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) + 1 );
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + moveCol );
            }

            // bottom left move
            moveCol = parseInt( cellId[1] ) - 2;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) - 1 );
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + moveCol );
            }

            // left bottom move
            moveCol = parseInt( cellId[1] ) - 1;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) - 2 );
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + moveCol );
            }

            // left top move
            moveCol = parseInt( cellId[1] ) + 1;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) - 2 );
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + moveCol );
            }

            // top left move
            moveCol = parseInt( cellId[1] ) + 2;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) - 1 );
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + moveCol );
            }
        }

        // Bishop and Queen
        if ( piece[1] == 'B' || piece[1] == 'Q' ) {

            // top right diag
            prevRow = undefined; prevCol = undefined;
            moveCol = parseInt( cellId[1] ) + 1;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) + 1 );
            // first: click if the move is inbound | second: click if the cell is free or occupied by a piece of the opposite color, loop | third: click if before the pieces encountered there was stg | same logic for the next moves
            while ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) && 
                    ( prevCol == undefined || document.getElementById( prevRow + String( prevCol ) ).innerHTML == "" ) ) {
                res.push( moveRow + moveCol );
                prevCol = moveCol;
                prevRow = moveRow;
                moveCol += 1;
                moveRow = String.fromCharCode( moveRow.charCodeAt( 0 ) + 1 );
            }

            // bottom right diag
            prevRow = undefined; prevCol = undefined;
            moveCol = parseInt( cellId[1] ) - 1;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) + 1 );
            while ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) && 
                    ( prevCol == undefined || document.getElementById( prevRow + String( prevCol ) ).innerHTML == "" ) ) {
                res.push( moveRow + moveCol );
                prevCol = moveCol;
                prevRow = moveRow;
                moveCol -= 1;
                moveRow = String.fromCharCode( moveRow.charCodeAt( 0 ) + 1 );
            }

            // bottom left diag
            prevRow = undefined; prevCol = undefined;
            moveCol = parseInt( cellId[1] ) - 1;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) - 1 );
            while ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) && 
                    ( prevCol == undefined || document.getElementById( prevRow + String( prevCol ) ).innerHTML == "" ) ) {
                res.push( moveRow + moveCol );
                prevCol = moveCol;
                prevRow = moveRow;
                moveCol -= 1;
                moveRow = String.fromCharCode( moveRow.charCodeAt( 0 ) - 1 );
            }

            // top left diag
            prevRow = undefined; prevCol = undefined;
            moveCol = parseInt( cellId[1] ) + 1;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) - 1 );
            while ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) && 
                    ( prevCol == undefined || document.getElementById( prevRow + String( prevCol ) ).innerHTML == "" ) ) {
                res.push( moveRow + moveCol );
                prevCol = moveCol;
                prevRow = moveRow;
                moveCol += 1;
                moveRow = String.fromCharCode( moveRow.charCodeAt( 0 ) - 1 );
            }

        }

        //King
        if ( piece[1] == 'K' ) {

            // top move
            moveCol = parseInt( cellId[1] ) + 1;
            // first: click if the move is inbound | second: click if the cell is free or occupied by a piece of the opposite color | same logic for the next moves
            if ( moveCol <= 8 && moveCol >= 1 && ( document.getElementById( cellId[0] + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( cellId[0] + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( cellId[0] + moveCol );
            }

            // top right move
            moveCol = parseInt( cellId[1] ) + 1;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) + 1 );
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + moveCol );
            }

            // right move
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) + 1 );
            if ( moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + cellId[1] ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + cellId[1] ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + cellId[1] );
            }

            //bottom right move
            moveCol = parseInt( cellId[1] ) - 1;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) + 1 );
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + moveCol );
            }

            // bottom move
            moveCol = parseInt( cellId[1] ) - 1;
            if ( moveCol <= 8 && moveCol >= 1 && ( document.getElementById( cellId[0] + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( cellId[0] + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( cellId[0] + moveCol );
            }

            // bottom left move
            moveCol = parseInt( cellId[1] ) - 1;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) - 1 );
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + moveCol );
            }

            // left move
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) - 1 );
            if ( moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + cellId[1] ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + cellId[1] ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + cellId[1] );
            }

            // top left move
            moveCol = parseInt( cellId[1] ) + 1;
            moveRow = String.fromCharCode( cellId[0].charCodeAt( 0 ) - 1 );
            if ( moveCol <= 8 && moveCol >= 1 && moveRow.charCodeAt( 0 ) <= 104 && moveRow.charCodeAt( 0 ) >= 97 && ( document.getElementById( moveRow + String( moveCol ) ).innerHTML == "" || 
                    ( this.getPieceByCellId( document.getElementById( moveRow + String( moveCol ) ).id )[0] != piece[0] ) ) ) {
                res.push( moveRow + moveCol );
            }
        }

        return res;
    }

    // return the list of all the moves possible for a color in the game and update the position of the kings
    allMoves ( color ) {
        
        let allMoves = [];
        let idA = 'a', idB = 8, i = 0;
        let actualColor;

        while ( this.config[i] != ' ' ) {
            if ( this.config[i] == '/' ) {
                idA = 'a';
                idB -= 1;
                i += 1;
            }

            if ( this.config[i].charCodeAt( 0 ) <= 90 && this.config[i].charCodeAt( 0 ) >= 65 )
                actualColor = 'w';
            else 
                actualColor = 'b';

            if ( this.config[i] == 'k' )
                this.bK = idA + idB;
            if ( this.config[i] == 'K' )
                this.wK = idA + idB;
            
            if ( this.getPieceByCellId( idA + idB ) && actualColor == color ) {
                allMoves.push( this.allowedMoves( idA + idB ) );
            }
            idA = String.fromCharCode( idA.charCodeAt( 0 ) + 1 );
            i += 1;
        }

        return allMoves;
    }

    // highlight or not cell
    highlight( bool, cell ) {

        cell.style.padding = bool ? "0px" : "4px";
        cell.style.border = bool ? "solid 4px yellow" : "none";
        cell.className = cell.classList[0] + ( bool ? " clicked" : " unclicked" );
        this.config = this.config.slice( 0, -1 ) + ( bool ? '1' : '0' );

    }

    // color the cell depending if the a cell is clicked
    color( clicked, cell ) {

        cell.style.backgroundColor = cell.classList[0] == "odd" ? ( clicked ? "#646464" : "#80391e" ) : ( clicked ? "#c8c8c8" : "#edb879" ) ;

    }

    // Call on click event on cell, allows it to highlight and move if possible
    click( cell ) {

        let pieceKilled;
        console.log( cell );
        if ( cell.innerHTML == "" && this.config[ this.config.length - 1 ] == 0 ) { // can't click an empty cell
            console.log( "This cell is empty." );
            return 0;
        }
        else {
            if ( this.clicked == undefined && this.config[ this.config.length - 3 ] != this.getPieceByCellId( cell.id )[0] ) // can't select a piece of the other color
                return 0;
            if ( this.clicked == undefined ) {
                this.moves = this.allowedMoves( cell.id );
                this.clicked = cell;
            }
            if ( cell.classList.length >= 2 && cell.classList[1] == "unclicked" && this.config[ this.config.length - 1 ] == 0 ) { // if the cell wasn't clicked, highlight it
                this.highlight( true, cell );
                for ( let i of this.moves )
                    this.color( true, document.getElementById( i ) );
            }
            else if ( cell.classList.length >= 2 && cell.classList[1] == "clicked" ) { // if the cell was clicked, unclicked it
                this.highlight( false, cell );
                for ( let i of this.moves )
                    this.color( false, document.getElementById( i ) );
                this.clicked = undefined;
                this.moves = undefined;
            }
            else {
                for ( let i of this.moves ) {
                    if ( cell.id == i ) { // the piece selected moves
                        if ( this.config[ this.getIndexOfCell( cell.id ) ] != '_' ) // a piece is kill
                            pieceKilled = this.config[ this.getIndexOfCell( cell.id ) ];
                        this.config = this.config.substring( 0, this.getIndexOfCell( cell.id ) ) + this.config[ this.getIndexOfCell( this.clicked.id ) ] + this.config.substring( this.getIndexOfCell( cell.id ) + 1 );
                        this.config = this.config.substring( 0, this.getIndexOfCell( this.clicked.id ) ) + '_' + this.config.substring( this.getIndexOfCell( this.clicked.id ) + 1 );
                        this.highlight( false, this.clicked );
                        for ( let i of this.moves )
                            this.color( false, document.getElementById( i ) );
                        this.clicked = undefined;
                        this.moves = undefined;
                        // Handle turn
                        if ( this.config[ this.config.length - 3 ] == 'w' ) {
                            this.config = this.config.substring( 0, this.config.length - 3 ) + 'b' + this.config.substring( this.config.length - 2 );
                        }
                        else {
                            this.config = this.config.substring( 0, this.config.length - 3 ) + 'w' + this.config.substring( this.config.length - 2 );
                        }
                        if ( pieceKilled && pieceKilled.toUpperCase( ) == 'K' ) {
                            if ( pieceKilled == 'k' )
                                this.end( 'White' );
                            else 
                                this.end( 'Black' );
                        }
                    }
                }
            }
        }

        this.update( );

    }

    // verify if a pawn get to the end of the board
    isPawnAtEnd( ) {
        
        let i = 0;
        // Loop for the first row
        while ( this.config[i] != ' ' ) {
            if ( this.config[i] == 'P' ) // White Pawn
                this.config = this.config.substring( 0, i ) + 'Q' + this.config.substring( i + 1 );
            if ( this.config[i] == 'p' ) // Black Pawn
                this.config = this.config.substring( 0, i ) + 'q' + this.config.substring( i + 1 );
            i += 1;
            if ( this.config[i] == '/') // At the end of the first row, skip to the last row
                i = 63
        }

    }

    // Verify if a king is killable
    isCheck( ) {

        let checkBlack = false, checkWhite = false;
        let h = document.getElementsByTagName( 'h1' );

        let allBlackMoves = this.allMoves( 'b' );
        let allWhiteMoves = this.allMoves( 'w' );
        
        for ( let i of allBlackMoves ) {
            for ( let k of i ) {
                if ( k == this.wK )
                    checkWhite = true;
            }
        }
        for ( let i of allWhiteMoves ) {
            for ( let k of i ) {
                if ( k == this.bK )
                    checkBlack = true;
            }
        }
        if ( checkBlack || checkWhite ) {
            h[0].innerHTML = "Check";
        }
        else {
            h[0].innerHTML = "";
        }

    }

    // End game
    end ( winner) {
        
        if ( confirm( winner + " wins !" ) ) {
            this.config = "rnbqkbnr/pppppppp/________/________/________/________/PPPPPPPP/RNBQKBNR w 0"; // reset the game
            this.init( );
        }

    }

    // main loop of the game, update after every action
    update( ) {

        this.isPawnAtEnd( );
        this.placePieces( );
        this.isCheck( );
    }

    // first method called, initialize all the element and the board
    init( ) {

        console.log( "ayayaya" );
        let td = document.getElementsByClassName( "unclicked" );
        let player;
        for ( let i of td ) {
            i.addEventListener( 'mousedown', event => {
                this.click( i ); 
            });
        }
        while ( true ) {
            player = prompt( "Please entre your name: " );
            if ( player != undefined && player != "" )
                break;
            else 
                console.log( 'Connected' );
        }
        this.update( );

    }

};

module.exports = Chessboard;