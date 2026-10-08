#include<iostream>
using namespace std;

class Base {
    int a = 5;
public:
    virtual void show() {
        cout << "Base class show function called. " <<a<< endl;
    }
};

class Derived : public Base {
    int b = 10;
public:
    void show() {   
        cout << "Derived class show function called. " <<b<< endl;
    }
};

int main(){
    Derived *ptr = new Base();
    ptr->show();  

    return 0;
}