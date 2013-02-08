/* 
 *  jquery.dynotable.js
 *  Created on Jan 22, 2013 13:06:39 by Goncharov Nikita
 *  
 *  add prefix class
 */
(function(jQuery){
	
	var methods = {};
	var helper = {
			modeDelete: 0
	};
	var settings = {},
		table = undefined;
		
	jQuery.dynoTable = {
		blocked : false,
		defaults : {
            prefixClass: 'dt_',
            emptyCell: "Empty",
            insertFadeSpeed: "slow",
            removeFadeSpeed: "slow",
            hideTableOnEmpty: true,
            logger: false,
            prefixHeadRowRight: "",
            onDeleteRow: function(index){},
            onDeleteColumn: function(index){},
            onRowAdd: function(){},
            onTableEmpty: function(){}
		},
		block : function() {
			$.tooltip.blocked = !$.tooltip.blocked;
		}
	};
	
	var logger = function(message, code) {
		if (!settings.logger) return;
		var $currentTime = new Date();
		var $selector = '';
		if (!code) code='';
		if (!message) message='';
		if (table != undefined) {
			$selector = table.context.nodeName;
			if (table.context.id) $selector = $selector + '#'+table.context.id;
			if (table.context.className) $selector = $selector + '.'+table.context.className;
		}
		console.log($currentTime.toLocaleDateString()+' '+$currentTime.toLocaleTimeString()+'::'+$selector+'::'+code+'::'+message);
		
	};
	
	var bindDeleteRow = function() {
		logger('Plugin dynoTable, private method bindDeleteRow');
		jQuery('.'+settings.prefixClass+'btnDeleteRow', table).unbind();
		jQuery('.'+settings.prefixClass+'btnDeleteRow', table).click(function() {
			var c = jQuery(this).parent().attr('c').split('x');
			methods['deleteRow'].apply(this, new Array(c[1]));
			settings.onDeleteRow(parseInt(c[1]));
		});
	};
	var bindDeleteColumn = function() {
		logger('Plugin dynoTable, private method bindDeleteColumn');
		jQuery('.'+settings.prefixClass+'btnDeleteColumn', table).unbind();
		jQuery('.'+settings.prefixClass+'btnDeleteColumn', table).click(function() {
			var c = jQuery(this).parent().attr('c').split('x');
			methods['deleteColumn'].apply(this, new Array(c[0]));
			settings.onDeleteColumn(parseInt(c[0]));
		});
	};
	
	methods = {
		init : function(options) {
			table = undefined;
            if((this.nodeName)&&(this.nodeName.toLowerCase() == 'table')) {
            	table = jQuery(this);
            }
            if ((this[0])&&(this[0].nodeName)&&(this[0].nodeName.toLowerCase() == 'table')) {
            	table = jQuery(this[0]);
            }
            
            if (!table) jQuery.error('Plugin dynoTable has error');
            
            settings = jQuery.extend(jQuery.dynoTable.defaults, options);
            
            var bntAddRow = '<th><b class="button '+settings.prefixClass+'addRow icon-plus"></b></th>';
            var bntAddColumn = '<th><b class="button '+settings.prefixClass+'addColumn icon-plus"></b></th>';
            
            logger('create table.');
            
            table.text('');
            
            //Create a table frame
            var thead = jQuery("<thead/>");
            var tbody = jQuery("<tbody/>");
            var tfoot = jQuery("<tfoot/>");
            
            //Create a valid format
            table.append(thead);
            table.append(tbody);
            table.append(tfoot);
            
            //Create controll
            bntAddRow = jQuery(bntAddRow);
            bntAddColumn = jQuery(bntAddColumn);
            
            var lineHead = jQuery("<tr/>");
            lineHead.append('<th></th>');
            lineHead.append(bntAddColumn);
            
            var lineFoot = jQuery("<tr/>");
            lineFoot.append(bntAddRow);
            
            thead.append(lineHead);
            tfoot.append(lineFoot);
            
           // methods['update'].apply(this, new Array('aaa', 'bbb'));
             
		},
		clear : function() {
			logger('Plugin dynoTable, method clear');
			jQuery("tbody", this).text('');
			jQuery("."+settings.prefixClass+"headRow", this).remove();
			jQuery("."+settings.prefixClass+"head", this).remove();
		},
		show : function() {
			logger('dynoTable show');
			logger(this);
			logger(settings);
		},
		hideAddCtrl : function() {
			jQuery('.'+settings.prefixClass+"addRow").hide('slow');
			jQuery('.'+settings.prefixClass+"addColumn").hide('slow');
		},
		showAddCtrl : function() {
			jQuery('.'+settings.prefixClass+"addRow").show('slow');
			jQuery('.'+settings.prefixClass+"addColumn").show('slow');
		},
		getCountRow : function() {
			logger('Plugin dynoTable, method getCountRow');
			$rows = jQuery('.'+settings.prefixClass+"headRow", this);
			return $rows.length;
		},
		getCountColumn : function() {
			logger('Plugin dynoTable, method getCountColumn');
			$colums = jQuery('.'+settings.prefixClass+"head", this);
			return $colums.length;
		},
		markRow : function(number, _class) {
			logger('Plugin dynoTable, method markRow');
			number = parseInt(number);
			if (isNaN(number)) {
				jQuery.error('Plugin dynoTable, method markRow arg is not integer.');
			}
			if (!_class) {
				_class = 'deleted';
			}
			$row = jQuery("*[class*='x"+number+"']", table);
			//Check for delete Column
			$row.addClass(settings.prefixClass+_class);
			return $row;
		},
		markColumn : function(number, _class) {
			logger('Plugin dynoTable, method markColumn');
			number = parseInt(number);
			if (isNaN(number)) {
				jQuery.error('Plugin dynoTable, method markColumn arg is not integer.');
			}
			if (!_class) {
				_class = 'deleted';
			}
			$columns = jQuery("*[class*='"+number+"x']", table);
			//Check for delete Row
			$columns.addClass(settings.prefixClass+_class);
			return $columns;
		},
		unMarkRow : function(number, _class) {
			logger('Plugin dynoTable, method unMarkRow');
			number = parseInt(number);
			if (isNaN(number)) {
				jQuery.error('Plugin dynoTable, method unMarkRow arg is not integer.');
			}
			if (!_class) {
				_class = 'deleted';
			}
			
			var allRows = jQuery("th[class*='x"+number+"']", this).removeClass(settings.prefixClass+_class);
			
			$rows = jQuery("td[class*='x"+number+"']", this);
			//Check for delete Column
			for ( var i = 0; i < $rows.length; i++) {
				var $row = jQuery($rows.get(i));
				if (! jQuery("."+i+"x").first().hasClass(settings.prefixClass+_class)) {
					$row.removeClass(settings.prefixClass+_class);
				}
			}
			
			return allRows.add($rows);
		},
		unMarkColumn : function(number, _class) {
			logger('Plugin dynoTable, method unMarkColumn');
			number = parseInt(number);
			if (isNaN(number)) {
				jQuery.error('Plugin dynoTable, method unMarkColumn arg is not integer.');
			}
			if (!_class) {
				_class = 'deleted';
			}
			
			var allColumn = jQuery("th[class*='"+number+"x']", this).removeClass(settings.prefixClass+_class);
			
			$columns = jQuery("td[class*='"+number+"x']", this);
			//Check for delete Row
			for ( var i = 0; i < $columns.length; i++) {
				var $column = jQuery($columns.get(i));
				if (! jQuery(".x"+i).first().hasClass(settings.prefixClass+_class)) {
					$column.removeClass(settings.prefixClass+_class);
				}
				
			}
			
			return allColumn.add($columns);
		},
		deleteRow : function(number) {
			logger('Plugin dynoTable, method deleteRow');
			$rows = methods['markRow'].apply(this, new Array(number, 'deleted'));
			$rows.hide();
		},
		deleteColumn : function(number) {
			logger('Plugin dynoTable, method deleteColumn');
			$columns = methods['markColumn'].apply(this, new Array(number, 'deleted'));
			$columns.hide();
		},
		recoverRow : function(number) {
			logger('Plugin dynoTable, method recoverRow');
			$rows = methods['unMarkRow'].apply(this, new Array(number, 'deleted'));
			$rows.show();
			$rows.each(function(index, cell) {
				$cell = jQuery(cell);
				$c = $cell.attr('c').split('x')[0];
				if (jQuery('.'+$c+'x').is(":hidden")) {
					$cell.hide();
				}
			});
			if (helper.modeDelete == 0){
				jQuery('.'+settings.prefixClass+'btnDeleteRow', $rows).addClass(settings.prefixClass+"hide").hide();
			} else {
				jQuery('.'+settings.prefixClass+'btnDeleteRow', $rows).removeClass(settings.prefixClass+"hide").show();
			}
		},
		recoverColumn : function(number) {
			logger('Plugin dynoTable, method recoverColumn');
			$columns = methods['unMarkColumn'].apply(this, new Array(number, 'deleted'));
			$columns.show();
			$columns.each(function(index, cell) {
				$cell = jQuery(cell);
				$c = $cell.attr('c').split('x')[1];
				if (jQuery(".x"+$c).is(":hidden")) {
					$cell.hide();
				}
			});
			if (helper.modeDelete == 0){
				jQuery('.'+settings.prefixClass+'btnDeleteColumn', $columns).hide().addClass(settings.prefixClass+"hide");
			} else {
				jQuery('.'+settings.prefixClass+'btnDeleteColumn', $columns).removeClass(settings.prefixClass+"hide").show();
			}
		},
		removeRow : function(number) {
			logger('Plugin dynoTable, method removeRow');
			methods['markRow'].apply(this, new Array(number, 'deleted'))
			.hide(settings.insertFadeSpeed)
			.remove();
		},
		removeColumn : function(number) {
			logger('Plugin dynoTable, method removeColumn');
			methods['markColumn'].apply(this, new Array(number, 'deleted'))
			.show()
			.hide(settings.insertFadeSpeed)
			.remove();
		},
		insertRow : function(data, head, position) {
			logger('Plugin dynoTable, method insertRow');
			var btnDeleteRow = '<b class="button '+settings.prefixClass+'btnDeleteRow '+settings.prefixClass+'hide icon-minus"></b>';
			
			if (!(data instanceof Array)) {
				jQuery.error('Plugin dynoTable, method insertRow first arg is not array.');
			}
			if (!head) head = "";
			
			var $th = jQuery("<th/>");
			var $thR = jQuery("<th/>").html(settings.prefixHeadRowRight);
			var $line = jQuery("<tr/>").addClass(settings.prefixClass+"hide");

			$th.text(head);
			$th.append(jQuery(btnDeleteRow).addClass(settings.prefixClass+"row"));
			$line.append($th);
			
			$countRow = jQuery('.'+settings.prefixClass+'headRow', this).length;
			$countColumn = jQuery('.'+settings.prefixClass+'head', this).length;

			for ( var i = 0; i < $countColumn; i++) {
				var $td = jQuery("<td/>");
				if (data[i]) {
					$td.html(data[i]);
				} else {
					$td.text(settings.emptyCell);
				}
				$td.attr('c', i+"x"+($countRow));
				$td.addClass(i+"x"+($countRow)).addClass(settings.prefixClass+"cell");
				
				//Проверяем ячейку что она не в удаленном столбце
				if (!jQuery('.'+i+'x').is(":visible")){
					$td.addClass(settings.prefixClass+'deleted');
					$td.hide();
				}
				
				$line.append($td);
			}
			
			$line.append($thR);
			$th.addClass('x'+($countRow)).addClass(settings.prefixClass+"headRow");
			$thR.addClass('x'+($countRow));
			$th.attr('c', 'x'+($countRow));
			$thR.attr('c', 'x'+($countRow));
			
			jQuery("tbody", this).append($line);
			$line.hide().removeClass(settings.prefixClass+"hide").show(settings.insertFadeSpeed);

			bindDeleteRow();
		},
		insertColumn : function(data, head, way) {
			logger('Plugin dynoTable, method insertColumn');
			
			var btnDeleteColumn = '<b class="button '+settings.prefixClass+'btnDeleteColumn '+settings.prefixClass+'hide icon-minus"></b>';
			var $way = " th:last";
			
			if (!(data instanceof Array)) {
				jQuery.error('Plugin dynoTable, method insertRow first arg is not array.');
			}
			if (!head) head = "";
			if (way == "west") $way = " th:first";
			
			var $th = jQuery("<th/>").addClass(settings.prefixClass+"hide");
			$th.text(head);
			$th.append(jQuery(btnDeleteColumn).addClass(settings.prefixClass+"column"));
			
			if( way == "west") {
				$th.insertAfter(jQuery("thead tr "+$way, this));
			} else {
				$th.insertBefore(jQuery("thead tr "+$way, this));
			}
			
			$countColumn = jQuery('.'+settings.prefixClass+'head', this).length;
			$setRow = jQuery('.'+settings.prefixClass+'headRow', this).parent();
			
			if (way == "west") {
				//var $cc = jQuery('.dt_head', t).first().attr('c').split('x');
				//$countColumn = $cc[0] - 1;
				//TODO For this project
				$countColumn = -1;
			}
			
			var $dels = $();
			for ( var i = 0; i < $setRow.length; i++) {
				var $row = jQuery($setRow.get(i));
				var $td = jQuery("<td/>").addClass(settings.prefixClass+"hide");
				if (data[i]) {
					$td.html(data[i]);
				} else {
					$td.text(settings.emptyCell);
				}
				$td.attr('c', $countColumn+"x"+i);
				$td.addClass($countColumn+"x"+i).addClass(settings.prefixClass+"cell");
				
				//Проверяем ячейку что она не в удаленной строке
				if (!jQuery('.'+'x'+i).is(":visible")){
					$dels = $dels.add($td);
				}
				
				if( way == "west") {
					$td.insertAfter(jQuery($way, $row));
				} else {
					$td.insertBefore(jQuery($way, $row));
				}
			}

			$th.addClass($countColumn+"x").addClass(settings.prefixClass+"head");
			$th.attr('c', $countColumn+"x");
			
			$th.add(jQuery("."+settings.prefixClass+"cell."+settings.prefixClass+"hide", this)).removeClass(settings.prefixClass+"hide").hide().show(settings.insertFadeSpeed);
			
			//Скрываем удаленные ячекйки
			$dels.addClass(settings.prefixClass+'deleted');
			$dels.hide();
			
			bindDeleteColumn();
		},
		setValueCell : function(value, x, y) {
			logger('Plugin dynoTable, method setValueCell');
			x = parseInt(x);
			y = parseInt(y);
			if (isNaN(x)) jQuery.error('Plugin dynoTable, method setValueCell second arg is not integer.');
			if (isNaN(y)) jQuery.error('Plugin dynoTable, method setValueCell third arg is not integer.');
			
			$cell = jQuery("."+x+"x"+y+"", this);
			if ($cell.length != 1 ) jQuery.error('Plugin dynoTable, method setValueCell has error: cell not one');
			$cell.html(value);
		},
		modeDelete : function() {
			logger('Plugin dynoTable, method modeDelete');
			if (jQuery(".dt_btnDeleteRow", this).hasClass(settings.prefixClass+"hide")) {
				jQuery(".dt_btnDeleteRow", this).removeClass(settings.prefixClass+"hide").hide().show('slow');
				jQuery(".dt_btnDeleteColumn", this).removeClass(settings.prefixClass+"hide").hide().show('slow');
				methods['hideAddCtrl'].apply(this, new Array());
				helper.modeDelete = 1;
			} else {
				jQuery(".dt_btnDeleteRow", this).hide('slow').addClass(settings.prefixClass+"hide");
				jQuery(".dt_btnDeleteColumn", this).hide('slow').addClass(settings.prefixClass+"hide");
				methods['showAddCtrl'].apply(this, new Array());
				helper.modeDelete = 0;
			}
		}
	};

	jQuery.fn.dynoTable = function(method) {
		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			jQuery.error('Method ' + method + ' does not exist on jQuery.dynoTable');
		}

	};

})(jQuery);