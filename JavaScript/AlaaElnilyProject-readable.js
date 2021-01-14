///////////////////////Creating Database///////////////////////

var db = openDatabase('Pharmacya', '1.0', 'Pharmacy db', 2 * 1024 * 1024);
var msg;
var Password = CryptoJS.MD5('1234')
db.transaction(function (tx) {
   tx.executeSql('CREATE TABLE IF NOT EXISTS Users (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,Name UNIQUE, Password)');
   tx.executeSql('INSERT INTO Users (Name, Password) VALUES ("Admin",?)', [Password]);
});

db.transaction(function (tx) {
   tx.executeSql('CREATE TABLE IF NOT EXISTS Items (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Name,  Quantity, Price, Picture)');
})


db.transaction(function (tx) {
   tx.executeSql('CREATE TABLE IF NOT EXISTS Invoice (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Date, CustomerName, Type, Item, Quantity, Price, TotalPrice)');
})


///////////////////////LOGIN/////////////////////// 

function datacheck() {
   var db = openDatabase('Pharmacya', '1.0', 'Pharmacy db', 2 * 1024 * 1024);
   var Name1 = document.getElementById("username1").value;
   document.cookie = Name1
   var Password1 = document.getElementById("password1").value;
   var mdPassword1 = CryptoJS.MD5(Password1)
   if (Name1 == "Admin" && Password1 == "1234") {
      window.location.pathname = "./HTML/adminintface.html";
   }
   else {
      db.transaction(function (tx) {
         tx.executeSql('SELECT Id FROM Users WHERE Name=? and Password=?', [Name1, mdPassword1],
            function (tx, result) {
               if (result.rows.length) {
                  window.location.pathname = "./HTML/manageitems.html";
               }
               else {
                  document.getElementById("loginalert").innerHTML = '<div class="alert alert-danger text-center" role="alert">Wrong User Name or Password</div>'
               }

            }
         );
      })
   }
}

///////////////////////Admin Check/////////////////////// 

function admincheck() {
   if (document.cookie != "Admin") {
      alert("You have to be an admin to access this page!")
      window.location.replace("../index.html");
   }
}

///////////////////////NAVIGATION/////////////////////// 

function GoManItems() {
   window.location.pathname = "./HTML/manageitems.html"
}
function GoManUsers() {
   window.location.pathname = "./HTML/manageusers.html"
}
function GoBuyItems() {
   window.location.pathname = "./HTML/buyitem.html"
}
function GoSellItems() {
   window.location.pathname = "./HTML/sellitem.html"
}

///////////////////////MANAGE USERS/////////////////////// 
///////////////////////ADD USER///////////////////////

function AddUser() {
   var db = openDatabase('Pharmacya', '1.0', 'Pharmacy db', 2 * 1024 * 1024);
   var Name = document.getElementById("username").value;
   var Password = document.getElementById("password").value;
   var mdPassword = CryptoJS.MD5(Password)
   db.transaction(function (tx) {
      tx.executeSql('SELECT Name FROM Users WHERE Name=?', [Name],
         function (tx, result) {
            if (!result.rows.length) {
               db.transaction(function (tx) {
                  tx.executeSql('INSERT INTO Users (Name, Password) VALUES (?,?)', [Name, mdPassword]);
                  document.getElementById("useralert").innerHTML = '<div class="alert alert-success text-center" role="alert">User Added Succesfully</div>'
               })
            } else {
               document.getElementById("useralert").innerHTML = '<div class="alert alert-danger text-center" role="alert">User name already exists!</div>'
            }
         }
      );
   })
}

///////////////////////Remove USER///////////////////////

function RemoveUser() {
   var db = openDatabase('Pharmacya', '1.0', 'Pharmacy db', 2 * 1024 * 1024);
   var Name = document.getElementById("username").value;
   db.transaction(function (tx) {
      tx.executeSql('SELECT Name FROM Users WHERE Name=?', [Name],
         function (tx, result) {
            if (result.rows.length && result.rows.item(0).Name == "Admin") {
               console.log(result)
               console.log("in admin if")
               document.getElementById("useralert").innerHTML = "<div class='alert alert-danger text-center' role='alert'>Admin can't be removed!</div>"
            }
            else if (result.rows.length) {
               db.transaction(function (tx) {
                  tx.executeSql('DELETE FROM Users WHERE Name =?', [Name]);
                  document.getElementById("useralert").innerHTML = '<div class="alert alert-success text-center" role="alert">User Removed Succesfully</div>'
               })
            } else {
               console.log("in last else")
               document.getElementById("useralert").innerHTML = '<div class="alert alert-danger text-center" role="alert">No user with this name!</div>'
            }
         }
      );
   })
}
///////////////////////USERS VIWE/////////////////////// 

function viewusers() {
   db.transaction(function (tx) {
      tx.executeSql('SELECT Id, Name FROM Users', [], function (tx, results) {
         var html = "<h2 style='text-align:center;'>Users</h2><br><table class='mx-auto'><tr><th>ID</th><th>UserName</th></tr> ";
         console.log(results)
         for (var i = 0; i < results.rows.length; i++) {
            html += "<tr>";
            for (var it in results.rows.item(i)) {
               html += "<td>" + results.rows.item(i)[it] + "</td>";
            }
            html += "</tr>";
         }
         html += "</table><i class='bi bi-printer-fill' onclick='window.print()' style='font-size: 3rem;'></i>";
         document.getElementById("today").innerHTML = html;
      }, null);
   });
}

///////////////////////TODAY INVOICE VIWE/////////////////////// 

function todayinvoice() {
   db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM Invoice where Date=?', [fd], function (tx, results) {
         var html = "<h2 style='text-align:center;'>Invoice</h2><br><table class='mx-auto'><tr><th>ID</th><th>Date</th><th>User</th> <th>Type</th><th>Items</th><th>Quantity</th> <th>Price</th><th>Total Price</th></tr> ";
         console.log(results)
         for (var i = 0; i < results.rows.length; i++) {
            html += "<tr>";
            for (var it in results.rows.item(i)) {
               html += "<td>" + results.rows.item(i)[it] + "</td>";
            }
            html += "</tr>";
         }
         html += "</table><i class='bi bi-printer-fill' onclick='window.print()' style='font-size: 3rem;'></i>";
         document.getElementById("today").innerHTML = html;
      }, null);
   });
}

///////////////////////EACH USER INVOICE/////////////////////// 

function viewmyinvoices() {
   console.log("hi")
   db.transaction(function (tx) {
      console.log("hi2")
      tx.executeSql('SELECT * FROM Invoice where Date=? and CustomerName=?', [fd, document.cookie], function (tx, results) {
         console.log("hi3")
         var html = "<h2 style='text-align:center;'>Invoice</h2><br><table class='mx-auto'><tr><th>ID</th><th>Date</th><th>User</th> <th>Type</th><th>Items</th><th>Quantity</th> <th>Price</th><th>Total Price</th></tr> ";
         console.log(results)
         for (var i = 0; i < results.rows.length; i++) {
            html += "<tr>";
            for (var it in results.rows.item(i)) {
               html += "<td>" + results.rows.item(i)[it] + "</td>";
            }
            html += "</tr>";
         }
         html += "</table><i class='bi bi-printer-fill' style='font-size: 3rem;'></i>";
         document.getElementById("use").innerHTML = html;
      }, null);
   });
}

///////////////////////VIEW ITEMS/////////////////////// 

db.transaction(function (tx) {
   tx.executeSql('SELECT * FROM Items', [], function (tx, results) {
      for (var i = 0; i < results.rows.length; i++) {

         var name = results.rows.item(i).Name
         var quantity = results.rows.item(i).Quantity
         var price = results.rows.item(i).Price
         var Picture = results.rows.item(i).Picture

         const n = document.createElement("p");
         const q = document.createElement("p");
         const p = document.createElement("p");
         const img = document.createElement("img");
         const li = document.createElement("li");

         n.innerText = "Product Name: " + name;
         li.appendChild(n);

         img.src = Picture;
         img.id = "product";
         li.appendChild(img);

         q.innerText = "Quantity: " + quantity;
         li.appendChild(q);

         p.innerText = "Price: " + price;
         li.appendChild(p);
         li.id = "liproduct"
         ul.appendChild(li);
      }
   })
})
///////////////////////CAMERA SCREENSHOT/////////////////////// 
var fd = new Date().toLocaleDateString();
var video = document.querySelector("#videoElement");
var canvas = document.querySelector("#showscreenshot");

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
   navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function (stream) {
         video.srcObject = stream;
      })
      .catch(function (error) {
         console.log("Something went wrong!");
      });
}

function stop(e) {
   var stream = video.srcObject;
   var tracks = stream.getTracks();

   for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
   }
   video.srcObject = null;
}


function takescreenshot() {
   canvas.width = video.videoWidth;
   canvas.height = video.videoHeight;
   canvas.getContext("2d").drawImage(video, 0, 0);
};

///////////////////////MANAGE ITEMS///////////////////////
///////////////////////ADD ITEM///////////////////////

function AddItem() {
   var html = "";
   var db = openDatabase('Pharmacya', '1.0', 'Pharmacy db', 2 * 1024 * 1024);
   var url = canvas.toDataURL()
   var itemName = document.getElementById("itemname").value;
   var quantity = document.getElementById("itemquantity").value;
   var price = document.getElementById("itemprice").value;
   db.transaction(function (tx) {
      tx.executeSql('SELECT Name FROM Items WHERE Name=? ', [itemName],
         function (tx, result) {
            if (result.rows.length) {
               var insert = confirm("Product is already inserted, Do you want to update quantity?")
               if (insert) {
                  db.transaction(function (tx) {
                     tx.executeSql('update items set Quantity=Quantity+? where name=?', [quantity, itemName]);
                     document.getElementById("buyalert").innerHTML = '<div class="alert alert-success text-center" role="alert">Product Updated</div>'
                  })
                  db.transaction(function (tx) {
                     tx.executeSql('INSERT INTO Invoice (Date, CustomerName, Type, Item, Quantity, Price, TotalPrice) VALUES (?,?,"Buy",?,?,?,?)', [fd, document.cookie, itemName, quantity, price, quantity * price]);
                  })
               } else { return }
            }
            else {
               db.transaction(function (tx) {
                  tx.executeSql('INSERT INTO Items (Name, Quantity, Price, Picture) VALUES (?,?,?,?)', [itemName, quantity, price, url]);
                  document.getElementById("buyalert").innerHTML = '<div class="alert alert-success text-center" role="alert">Product Added</div>'
               })

               db.transaction(function (tx) {
                  tx.executeSql('INSERT INTO Invoice (Date, CustomerName, Type, Item, Quantity, Price, TotalPrice) VALUES (?,?,"Buy",?,?,?,?)', [fd, document.cookie, itemName, quantity, price, quantity * price]);
               })
            }
            db.transaction(function (tx) {
               tx.executeSql('SELECT * FROM Invoice where item=? and Type="Buy"', [itemName], function (tx, results) {
                  for (var i = results.rows.length - 1; i < results.rows.length; i++) {
                     html += "<tr>";
                     for (var it in results.rows.item(i)) {
                        html += "<td>" + results.rows.item(i)[it] + "</td>";
                     }
                     html += "</tr>";
                  }

                  document.getElementById("invoicetablebuy").innerHTML += html;
               }, null);
            });
         }
      );
   })
}


///////////////////////SELL ITEM///////////////////////  

function RemoveItem() {
   var html = "";
   var db = openDatabase('Pharmacya', '1.0', 'Pharmacy db', 2 * 1024 * 1024);
   var ItemNamesell = document.getElementById("itemnames").value;
   var ItemQuantity = document.getElementById("itemquantitys").value;
   db.transaction(function (tx) {
      tx.executeSql('SELECT Name FROM Items WHERE Name=? ', [ItemNamesell],
         function (tx, result) {

            if (result.rows.length) {
               db.transaction(function (tx) {
                  tx.executeSql('SELECT * FROM Items where (Quantity-?) >= 0 and name=?', [ItemQuantity, ItemNamesell],
                     function (tx, results) {
                        if (results.rows.length) {
                           db.transaction(function (tx) {
                              tx.executeSql('update items set Quantity=Quantity-? where name=?', [ItemQuantity, ItemNamesell]);
                              document.getElementById("sellalert").innerHTML = '<div class="alert alert-success text-center" role="alert">Product Updated</div>'
                           })

                           db.transaction(function (tx) {
                              tx.executeSql('SELECT * FROM Items where Name=?', [ItemNamesell], function (tx, resultss) {

                                 var Price = resultss.rows.item(0).Price

                                 tx.executeSql('INSERT INTO Invoice (Date, CustomerName, Type, Item, Quantity, Price, TotalPrice) VALUES (?,?,"Sell",?,?,?,?)', [fd, document.cookie, ItemNamesell, ItemQuantity, Price, ItemQuantity * Price]);
                              });
                           })
                           db.transaction(function (tx) {
                              tx.executeSql('SELECT * FROM Invoice where item=? and Type="Sell"', [ItemNamesell], function (tx, resul) {
                                 for (var i = resul.rows.length - 1; i < resul.rows.length; i++) {
                                    html += "<tr>";
                                    for (var it in resul.rows.item(i)) {
                                       html += "<td>" + resul.rows.item(i)[it] + "</td>";
                                    }
                                    html += "</tr>";
                                 }
                                 document.getElementById("invoicetablesell").innerHTML += html;
                              }, null);
                           })
                        } else {
                           document.getElementById("sellalert").innerHTML = '<div class="alert alert-danger text-center" role="alert">The product Quantity is less than entered!</div>'
                        }
                     });
               })

            }
            else {
               document.getElementById("sellalert").innerHTML = '<div class="alert alert-danger text-center" role="alert">No item with this name!</div>'
            }
         }
      );
   })
}

///////////////////////FOOTER/////////////////////// 

function phone() {
   alert("Pharmacya Phone number is 03-xxxxxxx")
}
function Email() {
   location.href = "mailto:alaa.s.elnily@gmail.com";
} 