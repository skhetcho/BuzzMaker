import os

print("\n\n######\n A quick script to modify api keys and store id to build the project \n######\n\n")


# gather the information
def infoGathering():
    global storeID
    global googleApiKey
    global storeLogo
    storeID = input("What is the store id: ")
    googleApiKey = input("What is the desired Google Maps Api Key: ")
    storeLogo = input("Do you have a desired logo for this store (Y/N): ")

# modify the file
def fileModification():
    with open("./src/constants/variables_BAK.js", "w") as file:
        file.write("export const google_api_key = '" + googleApiKey + "';\n")
        file.write("export const place_id = '" + storeID + "';\n")
        file.write("export const logo_url = " + storeLogo + ";")



# start execution
infoGathering()
if ( storeLogo == "y" or storeLogo == "Y" or storeLogo == "1" ):
    storeLogo = input("Paste the url of the logo here: ")
    fileModification()
    os.system("npm run build")

elif(storeLogo == "n" or storeLogo == "N" or storeLogo == "0"):
    storeLogo = "null"
    fileModification()
    os.system("npm run build")

else:
    print("\n\n invalid entry. Try again\n")
    infoGathering()
