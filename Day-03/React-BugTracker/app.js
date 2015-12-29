var Greeter = React.createClass({
    getInitialState : function(){
        return {message : '[default message]'};
    },
    onGreet : function(){
          console.log("Greet button is clicked");
          var name = this.refs.txtName.value;
          var count = parseInt(this.refs.txtCount.value, 10);
          var greetMsg = 'Hi ' + name + ', Have a nice day!';
          this.setState({message : greetMsg});
          this.setState({count : count});
        },
    render : function(){
        console.log('re rendering');
        var messages = [];
        for(var i=0; i<this.state.count;i++)
            messages.push((<div> {this.state.message} </div>))

        return (
          <div>
              <h3>Greeter</h3>
              <input type="text" ref="txtName" />
              <input type="text" ref="txtCount" />
              <input type="button" value="Greet" onClick={this.onGreet} id="btnGreet"/>
                {messages}
          </div>
        );
    }
});

var App = React.createClass({
    render : function(){
        return (
            <div>
                <ProductList />
            </div>
        )
    }
});

function Product(defaults){
    this.name = defaults.name || '';
    this.cost = defaults.cost || 0;
    this.units = defaults.units || 0;
    this.value = defaults.value || 0;
}
Product.prototype.updateValue = function(){
    this.value = this.units * this.cost;
}
var ProductList = React.createClass({
    
    componentDidMount : function(){
        var self=this;
        console.log("ComponentDidMount in PRoductItem");
        fetch("http://localhost:3000/products").then(function(data){
        data.json().then(function(jsonData){
            console.log(jsonData)
            self.setState({list: jsonData.map(function(item){
                var prod = new Product(item);
                prod.updateValue();
                return prod;
            })});
            self.updateValues();
        });
      });
    },
    getInitialState : function(){
        
        return {
            list : [],
            productTotalValue : 0 
        };
    },
    onAddProduct : function(){
        var self = this;
        var newProductName = this.refs.txtProductName.value;
        var newProduct = new Product({
            name : newProductName,
            units : 0,
            cost : 0,
            value : 0
        });
        var request = new Request('http://localhost:3000/products', {
            method:'POST',
            body:JSON.stringify(newProduct),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
        fetch(request).then(function(response){
            response.json().then(function(addedProd){
                self.state.list.push(addedProd);
                self.updateValues();     
            });
        });
    },
    updateValues : function(){
        this.setState({ productTotalValue : this.state.list.reduce(function(agg, product){
            return agg + product.value;
        }, 0)});
    },
    render : function(){
        console.log("render in ProductList");
        var productItems = this.state.list.map(function(product){
            return (<ProductItem data={product} onProductUpdate={this.updateValues}></ProductItem>)
        }.bind(this));
        return (
            <div>
                <h3>Product List</h3>
                <label>Product Name :</label>
                <input type="text" ref="txtProductName" />
                <input type="button" value="Add Product" onClick={this.onAddProduct} />
                <ol>
                    {productItems}
                </ol>
                <div>{this.state.productTotalValue}</div>
            </div>
        );
    }
});

var ProductItem = React.createClass({
    componentDidMount : function(){
        console.log("ComponentDidMount in PRoductItem");
    },
    getInitialState : function(){
        return {
            product : this.props.data
        };
    },
    updateProduct : function(){
        var product = this.state.product;
        product.cost = parseInt(this.refs.txtCost.value, 10);
        product.units = parseInt(this.refs.txtUnits.value, 10);
    },
    updateProductValue : function(){
        console.log(this.state.product);
        var product = this.state.product;
        product.updateValue();
        this.props.onProductUpdate();
    },
    render : function(){
        console.log("render in ProductItem");
        return (
            <li>
                <span>{this.state.product.name}</span>
                <input type="text" ref="txtCost" onChange={this.updateProduct} value={this.state.product.cost}/>
                <input type="text" ref="txtUnits" onChange={this.updateProduct} value={this.state.product.units}/>
                <input type="button" value="Update" onClick={this.updateProductValue} />
                <span>{this.state.product.value}</span>
            </li>
        )
    }
});

ReactDOM.render(
    <App></App>,
    document.getElementById("content")
);
