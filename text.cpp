#include <iostream>
using namespace std;

int main(){
	char cmp;
	
	cout<<"Are you gay?"<<endl;
	cout<<"Dome: Yes"<<endl;
	cout<<"U: Maybe i'm gay'"<<endl;
	
	cout<<"\nans: ";
	cin>>cmp;
	
	cout<<"\n--------------------"<<endl;
	if(cmp == 'a' || cmp == 'b' || cmp == 'c'){
		cout<<"You: Gay 100%"<<endl;
	}else{
		cout<<"You: Gay yu dee"<<endl;
	}
	cout<<"--------------------"<<endl;
	
	return 0;
}
