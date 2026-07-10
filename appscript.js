function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (action === "login") {
      // Basic secure verification for admin dashboard
      if (data.password === "msftech26") {
        return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid password" })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    if (action === "getAllRegistrations") {
      var dataRange = sheet.getDataRange();
      var values = dataRange.getValues();
      var registrations = [];
      for (var i = 1; i < values.length; i++) {
        registrations.push({
          id: String(values[i][1] || ''),
          ticketNumber: String(values[i][2] || ''),
          fullName: String(values[i][3] || ''),
          email: String(values[i][4] || ''),
          mobileNumber: String(values[i][5] || ''),
          whatsappNumber: String(values[i][6] || ''),
          age: String(values[i][7] || ''),
          gender: String(values[i][8] || ''),
          district: String(values[i][9] || ''),
          institution: String(values[i][10] || ''),
          occupation: String(values[i][11] || ''),
          foodPreference: String(values[i][12] || ''),
          checkedIn: values[i][13] === true || values[i][13] === 'TRUE' || values[i][13] === true,
          checkInTime: String(values[i][14] || ''),
          verificationToken: String(values[i][15] || '')
        });
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", registrations: registrations })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "register") {
      var lock = LockService.getScriptLock();
      
      // Wait for up to 30 seconds for other registrations to finish
      var success = lock.tryLock(30000);
      if (!success) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Server busy. Please try again." })).setMimeType(ContentService.MimeType.JSON);
      }

      try {
        var dataRange = sheet.getDataRange();
        var values = dataRange.getValues();
        
        // Check for duplicates
        for (var i = 1; i < values.length; i++) {
          var existingEmail = String(values[i][4]).trim().toLowerCase();
          var existingMobile = String(values[i][5]).trim();
          var newEmail = String(data.email).trim().toLowerCase();
          var newMobile = String(data.mobileNumber).trim();
          
          if ((newEmail && existingEmail === newEmail) || existingMobile === newMobile) {
             return ContentService.createTextOutput(JSON.stringify({ 
               status: "error", 
               message: "Already registered. Found existing user with this email or phone number." 
             })).setMimeType(ContentService.MimeType.JSON);
          }
        }

        // Generate unique ID based on accurate row count
        var count = values.length - 1; // excluding header
        var nextNumber = count + 1;
        var paddedNumber = nextNumber < 10 ? '00' + nextNumber : nextNumber < 100 ? '0' + nextNumber : nextNumber;
        var newId = "TC26A" + paddedNumber;

        // Generate Ticket Number
        var chars = '0123456789ABCDEF';
        var ticket = 'TC26-';
        for (var k = 0; k < 8; k++) {
          ticket += chars[Math.floor(Math.random() * chars.length)];
        }

        // Generate Verification Token
        var token = Utilities.base64Encode(newId + ":" + data.email).substring(0, 16);
        var timestamp = new Date().toISOString();

        sheet.appendRow([
          timestamp,
          newId,
          ticket,
          data.fullName,
          data.email,
          data.mobileNumber,
          data.whatsappNumber,
          data.age,
          data.gender,
          data.district,
          data.institution,
          data.occupation,
          data.foodPreference,
          false,
          '',
          token
        ]);

        return ContentService.createTextOutput(JSON.stringify({ 
          status: "success", 
          registration: {
            id: newId,
            ticketNumber: ticket,
            verificationToken: token,
            createdAt: timestamp
          }
        })).setMimeType(ContentService.MimeType.JSON);
      } finally {
        lock.releaseLock();
      }
    }

    if (action === "checkin") {
      var lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        var dataRange = sheet.getDataRange();
        var values = dataRange.getValues();
        var idToFind = String(data.id).trim().toUpperCase();

        for (var i = 1; i < values.length; i++) {
          if (String(values[i][1]).toUpperCase() === idToFind) {
             sheet.getRange(i + 1, 14).setValue(true);
             sheet.getRange(i + 1, 15).setValue(new Date().toISOString());
             return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
          }
        }
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Not found" })).setMimeType(ContentService.MimeType.JSON);
      } finally {
        lock.releaseLock();
      }
    }

    if (action === "revertCheckin") {
      var lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        var dataRange = sheet.getDataRange();
        var values = dataRange.getValues();
        var idToFind = String(data.id).trim().toUpperCase();

        for (var i = 1; i < values.length; i++) {
          if (String(values[i][1]).toUpperCase() === idToFind) {
             sheet.getRange(i + 1, 14).setValue(false);
             sheet.getRange(i + 1, 15).setValue('');
             return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
          }
        }
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Not found" })).setMimeType(ContentService.MimeType.JSON);
      } finally {
        lock.releaseLock();
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unknown action" })).setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: e.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
