// import * as Swal from "sweetalert2";
// const Swal = require('sweetalert2');
// import Swal from 'sweetalert2'
// import Swal from 'sweetalert2/dist/sweetalert2.js'

// import 'sweetalert2/src/sweetalert2.scss'
$(function() {
	$("input[type='password'][data-eye]").each(function(i) {
		let $this = $(this);
		$this.wrap($("<div/>", {
			style: 'position:relative'
		}));
		$this.css({
			paddingRight: 60
		});
		$this.after($("<div/>", {
			html: 'Show',
			class: 'btn btn-primary btn-sm',
			id: 'passeye-toggle-'+i,
			style: 'position:absolute;right:10px;top:50%;transform:translate(0,-50%);padding: 2px 7px;font-size:12px;cursor:pointer;'
		}));
		$this.after($("<input/>", {
			type: 'hidden',
			id: 'passeye-' + i
		}));
		$this.on("keyup paste", function() {
			$("#passeye-"+i).val($(this).val());
		});
		$("#passeye-toggle-"+i).on("click", function() {
			if($this.hasClass("show")) {
				$this.attr('type', 'password');
				$this.removeClass("show");
				$(this).removeClass("btn-outline-primary");
			}else{
				$this.attr('type', 'text');
				$this.val($("#passeye-"+i).val());				
				$this.addClass("show");
				$(this).addClass("btn-outline-primary");
			}
		});
	});

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	let forms = document.getElementsByClassName('needs-validation');
	// Loop over them and prevent submission
	let validation = Array.prototype.filter.call(forms, function(form) {
	  form.addEventListener('submit', function(event) {
		if (form.checkValidity() === false) {
		  event.preventDefault();
		  event.stopPropagation();
		}
		form.classList.add('was-validated');
	  }, false);
	});

	$(".singleSelect").select2();
	// $("input[type='text']").on("keyup",function(e){
	// 	let str = $(this).val();
	// 	let check = str.match("[a-zA-Z]+")
	// 	if(check !== null){
	// 		$(this).val(check);
	// 	}
	// })
	$("#UserNameLogin").on("keyup",function(e){
		//$("#invalidUserNameLogin").text("")
		//let str = $(this).val();
		//let regex = /[a-zA-Z]+/
		//console.log(str.match(regex)[0])
		// console.log(regex.exec(str))
		// let check = str.match("[a-zA-Z]+")
		//if(str.match(regex)[0] !== str.match(regex).input){
			//$("#invalidUserNameLogin").text("The username should be character a-zA-Z")
			// console.log("mohamed")
			// $(this).val(check);
		//}
	});
	$(".targetSpeaker").on("click",function (e) {
		e.preventDefault();
		$('.targetModal').modal('hide');
		$('.modal-backdrop.fade').removeClass('modal-backdrop');
		let id = this.classList[3];
		$.ajax({
			url:`${window.location.origin}/speaker/delete`,
			method:"POST",
			// contentType:"application/json",
			data:{_id:Number(id)},
			dataType:"json",
			success:function(result){
				$(`#${id}`).remove();
				let count = 1;
				let items = $(".idCount");
				console.log(items);
				for (let i = 0; i < items.length; i++) {
					items[i].innerHTML = count++;
				}
				const Toast = sweetAlert.mixin({
					toast: true,
					position: 'top-end',
					showConfirmButton: false,
					timer: 4000,
					timerProgressBar: true,
					onOpen: (toast) => {
						toast.addEventListener('mouseenter', Swal.stopTimer);
						toast.addEventListener('mouseleave', Swal.resumeTimer);
					}
				});

				Toast.fire({
					icon: 'success',
					title: 'The speaker is deleted successfully'
				})
			},
			error:function(error){
				const Toast = sweetAlert.mixin({
					toast: true,
					position: 'top-end',
					showConfirmButton: false,
					timer: 4000,
					timerProgressBar: true,
					onOpen: (toast) => {
						toast.addEventListener('mouseenter', Swal.stopTimer);
						toast.addEventListener('mouseleave', Swal.resumeTimer);
					}
				});
				Toast.fire({
					icon: 'error',
					title: 'The speaker is not deleted successfully'
				})
			}
		})
	})
	$(".addSpeaker").on("click",function (e) {
		// e.preventDefault();
		let FullName = $("#FullName").val();
		let UserName = $("#UserName").val();
		let Password = $("#Password").val();
		let city = $("#city").val();
		let street = $("#street").val();
		let building = $("#building").val();
		let image = $("#image");
		let validExtensions = ["jpg","jpeg","png"];
		let file = image.val().split('.').pop();
		// console.dir(image.split('.').pop());
		for (let i = 0; i < 7; i++) {
			$(".invalid")[i].style.display = "none";
		}
		for (let i = 0; i < 7; i++) {
			if($("input")[i].value === ""){
				e.preventDefault();
				$($(".invalid")[i]).css("display","block")
			}
		}
		if(FullName !== "" && UserName !== "" && Password !== "" && city !== "" && street !== "" && building !== "" && image.val() !== ""){
			// console.log(image[0],"ahmed");
			if (validExtensions.indexOf(file) == -1) {
				e.preventDefault();
				$(".invalid.invalidImage").css("display","block")
				$(".invalid.invalidImage").text("Only formats are allowed : " + validExtensions.join(', '))
			}
		}
	})
	$(".editSpeaker").on("click",function (e) {
		// e.preventDefault();
		let image = $(this).parent().parent().find(".checkImage");
		let validExtensions = ["jpg","jpeg","png"];
		let file = image.val().split('.').pop();
		// console.log(image.val());
		// console.log(file);
		for (let i = 0; i < 7; i++) {
			$(this).parent().parent().find(".invalid")[i].style.display = "none";
		}
		if(image.val() !== ""){
			// console.log(image[0],"ahmed");
			if (validExtensions.indexOf(file) == -1) {
				e.preventDefault();
				$(this).parent().parent().find(".invalid.invalidImage").css("display","block")
				$(this).parent().parent().find(".invalid.invalidImage").text("Only formats are allowed : " + validExtensions.join(', '))
			}
		}
	})
	$(".targetEvent").on("click",function (e) {
		e.preventDefault();
		$('.targetModal').modal('hide');
		$('.modal-backdrop.fade').removeClass('modal-backdrop');
		let id = this.classList[3];
		$.ajax({
			url:`${window.location.origin}/event/delete`,
			method:"POST",
			// contentType:"application/json",
			data:{_id:Number(id)},
			dataType:"json",
			success:function(result){
				$(`#${id}`).remove();
				let count = 1;
				let items = $(".idCount");
				console.log(items);
				for (let i = 0; i < items.length; i++) {
					items[i].innerHTML = count++;
				}

				const Toast = sweetAlert.mixin({
					toast: true,
					position: 'top-end',
					showConfirmButton: false,
					timer: 4000,
					timerProgressBar: true,
					onOpen: (toast) => {
						toast.addEventListener('mouseenter', Swal.stopTimer);
						toast.addEventListener('mouseleave', Swal.resumeTimer);
					}
				});

				Toast.fire({
					icon: 'success',
					title: 'The event is deleted successfully'
				})
			},
			error:function(error){
				const Toast = sweetAlert.mixin({
					toast: true,
					position: 'top-end',
					showConfirmButton: false,
					timer: 4000,
					timerProgressBar: true,
					onOpen: (toast) => {
						toast.addEventListener('mouseenter', Swal.stopTimer);
						toast.addEventListener('mouseleave', Swal.resumeTimer);
					}
				});

				Toast.fire({
					icon: 'error',
					title: 'The event is not deleted successfully'
				})
			}
		})
	})
});