use 'static'

const LittleApp = () => {
  return (
    <div>
      <MaterialUI.Button variant="contained" color="primary">
        Hello World
      </MaterialUI.Button>
    </div>
  )
}

ReactDOM.render(<LittleApp />, document.getElementById("like_button_container"));
