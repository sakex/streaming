#include <iostream>
#include <string>
#include <fstream>
#include <algorithm>

using namespace std;

int main(int argc, char const *argv[]) {
  int i, j = 0, len;
  long cyp = 1;

  if(argc < 5){
    cout << "Error: This program takes at least 3 parameters: <input_file> <output_file> <int1> <int2> [...]" << endl;
    return 1;
  }

  else{
    for(i = 3; i<argc; ++i){
      cyp *= stol(argv[i]);
    }
  }

  string cypher = to_string(cyp);
  int cyplen = cypher.length();

  ifstream iFile;
  iFile.open(argv[1]);
  ofstream oFile (argv[2], ofstream::out);

  string input;

  if (iFile.is_open()) {
    while (getline(iFile, input)) {

      //input += " ";
      len = input.length();
      //cout << input;
      for(i = 0; i < len; ++i){
        input[i] = char(int(input[i])+int(cypher[j]));
        if(j < cyplen) ++j;
        else j = 0;
      }

      oFile << input;
    }
    oFile.close();
    return 0;
  }

  else{
    cout << "Error: This file does not exist" << endl;
    return 1;
  }
}
