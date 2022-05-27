class ListItem {
	constructor(name="") {
		this.itemName = name; 			// string
		this.itemPrice = 0;				// float
		this.itemLoc = "";				// string
		this.itemPic = "";				// string
		this.itemBarcode = 0;			// int
		this.notes = "";				// string
		this.need = true;				// bool
		this.bought = false;			// bool
		this.staple = false;			// bool
		this.purchaseBy = 0;			// int
		this.purchaseInterval = 0;		// int
		this.purchaseHist = [ ];		// array of ints
		this.createdOn = Date.now();	// int
		this.addedOn = Date.now();		// int
		this.classVer = 1.0;			// float
	}
	getInterval() {
		let ret, hold, iter = 0;
		if(this.purchaseHist.length > 1) {
			for(let i=0; i<this.purchaseHist.length - 1; i++) {
				// Since we're storing purchase dates as raw timestamps, we
				// want to do a bit of processing here
				// JS timestamps are unix epoch in ms, and a day is
				// 3600 * 24 * 1000 = 86 400 000
				hold = Math.floor(this.purchaseHist[i] / 86400000);
				hold -= Math.floor(this.purchaseHist[i+1] / 86400000);
				if(hold) {
					ret += hold;
					iter++;
				}
			}
			ret /= iter;
		}
		return ret;
	}
	purchase() {
		this.bought = true;
	}
	sweep() {
		//let timestamp = new Date().now();
		this.bought = false;
		this.need = false;
		this.purchaseHist.unshift(Date.now());
	}
	timeSincePurchase() {
		return Math.floor((Date.now() - this.purchaseHist[0]) / 86400000);
	}
	listStaple() {
		if(timeSincePurchase >= this.purchaseInterval) {
			this.need = true;
			this.bought = false;
		}
	}
}

class List {
	constructor(name="") {
		this.listName = name;						// string
		this.creationDate = Date.now();		// int
		this.modifyDate = this.creationDate;		// int
		this.listContents = [ ];					// array of objects
		this.classVer = 1.0;
	}
	addTo(listItem) {
		this.listContents.push(listItem);
		listItem.addedOn = Date.now();
		this.modifyDate = Date.now();
	}
	getIndexByName(str) {
		for(let i=0; i<this.listContents.length; i++)
			//this.listContents[i].itemName === str ? return i : true;
			if(this.listContents[i].itemName === str)
				return i;
		return -1;
	}
	removeFrom(listItem) { // should never really need this
		let i = this.getIndexByName(listItem.itemName);
		if(i != -1) {
			this.listContents.splice(i, 1);
		}
		this.modifyDate = Date.now();
	}
	sweepAll() {
		for(const item of this.listContents) {
			item.bought ? item.sweep() : true;
		}
		this.modifyDate = Date.now();
	}
	getNeeded() {
		let retArr = [ ];
		for(const item of this.listContents) {
			item.need ? retArr.push(item) : true;
		}
		return retArr;
	}
	listStaples() {
		for(const item of this.listContents) {
			if(item.staple) {
				item.purchaseInterval = item.getInterval();
				item.listStaple();
			}
		}
	}
}

/* A list is an object that contains a list of objects and some metadata
 * The list should never really lose objects since it serves as its own library
 * of prior purchases
 * When an item is "added" to the list, its "need" flag is set to true
 * When the checkbox is clicked, the "bought" flag is also set to true
 * When the item is swept, both flags are set to false
 * An item whose "need" flag is set to false will not be displayed or returned
 * in the getNeeded() method which is the main way list items are enumerated
 * IDK if JS does private variables but if it did I'd make most of these private
 * and force interaction through methods
 */

/* A thought:
 * What if we include a function to simply return the needed accordion code in
 * the object itself?  Would that work?  I don't know!
 */

// Create a sample list with some sample items for debug purposes
const tList = new List("Test List");
tList.listContents = [ new ListItem("bologna"), new ListItem("cheese"), new ListItem("bread"), new ListItem("mayo") ];
//const it1 = new ListItem("bologna");
//const it2 = new ListItem("cheese");
//const it3 = new ListItem("bread");
//const it4 = new ListItem("mayonnaise");
