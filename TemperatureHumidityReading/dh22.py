import getopt
import sys
import time
from datetime import date

# Sensor imports
import adafruit_dht
import board

# read commandline arguments, first
fullCmdArguments = sys.argv

# - further arguments
argumentList = fullCmdArguments[1:]

# prepare the valid parameters
unixOptions = "t:v"
gnuOptions = ["help", "toFile=", "interval=", "directory="]

# parse the arguments
try:
    arguments, values = getopt.getopt(argumentList, unixOptions, gnuOptions)
except getopt.error as err:
    # output error, and return with an error code
    print(str(err))
    sys.exit(2)

# set some paramter defaults
toFile = True
interval = 10
directory = r"/media/usb/"

# Parsing the current argument's values
for currentArgument, currentValue in arguments:
    # HELP
    if currentArgument in ("-h", "--help"):
        print(
            "INTERVAL: The sleep time in seconds between readings. Defaults to 10 seconds.")
        print("TOFILE: TRUE/FALSE option to either print results to file or console. Defaults to TRUE")
        print("DIRECTORY: Location to save files. Defaults to /media/usb/")
    # DIRECTORY
    elif currentArgument in ("-d", "--directory"):
        print(("Using directory: %s.") % (currentValue))
        directory = currentValue
    # INTERVAL
    elif currentArgument in ("-i", "--interval"):
        print(("Using interval of %s seconds") % (currentValue))
        interval = currentArgument
    # TOFILE
    elif currentArgument in ("-t", "--toFile"):
        # TRUE
        if(currentValue in ("t", "T", "TRUE", "true")):
            print("Writing results to file")
            toFile = True
        # FALSE
        elif(currentValue in ("f", "F", "FALSE", "false")):
            toFile = False
            print("Writing results to terminal")
        # OTHER
        else:
            print(
                "Invalid toFile option. Use one of these options: t, f, true, false, TRUE, FALSE")
            sys.exit(2)

# Load the sensor
dht = adafruit_dht.DHT22(board.D4)

# main loop
while True:
    try:
        temperature = dht.temperature
        humidity = dht.humidity

        if(toFile):
            fileName = date.today().strftime('%m-%d-%Y') + ".txt"
            file = open(directory + fileName, "a")
            file.write(
                "Temp: {:.1f} *F \t Humidity: {}%\n".format((temperature*1.8), humidity))
            file.close()
        else:
            print(
                "Temp: {:.1f} *F \t Humidity: {}%".format((temperature*1.8), humidity))

    except RuntimeError as e:
        # Reading doesn't always work! Just print error and we'll try again
        if not toFile:
            print("Reading from DHT failure: ", e.args)
        else:
            file.close()
    except OSError as e:
        print("Could not open file: %s" % directory)
        sys.exit(2)

    time.sleep(interval)
